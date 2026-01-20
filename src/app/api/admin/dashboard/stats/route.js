import { createServerClient } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verify admin authentication
    const auth = await verifyAdmin();
    if (!auth.authenticated) {
      return NextResponse.json(
        { error: auth.error },
        { status: 401 }
      );
    }

    const supabase = createServerClient();

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString();

    // Get this month's date range
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartISO = monthStart.toISOString();

    // Parallel queries for dashboard stats
    const [
      todayOrdersResult,
      pendingOrdersResult,
      monthOrdersResult,
      lowStockResult,
      recentOrdersResult,
      totalRevenueResult
    ] = await Promise.all([
      // Today's orders count and revenue
      supabase
        .from('orders')
        .select('id, total_amount, payment_status')
        .gte('created_at', todayISO)
        .lt('created_at', tomorrowISO),

      // Pending orders count
      supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .eq('order_status', 'pending'),

      // This month's orders
      supabase
        .from('orders')
        .select('id, total_amount, payment_status')
        .gte('created_at', monthStartISO),

      // Low stock products
      supabase
        .from('products')
        .select('id, name, stock_quantity, low_stock_threshold')
        .eq('is_active', true)
        .lte('stock_quantity', 10), // Using a fixed threshold

      // Recent orders
      supabase
        .from('orders')
        .select('id, order_number, customer_first_name, customer_last_name, total_amount, order_status, payment_status, created_at')
        .order('created_at', { ascending: false })
        .limit(10),

      // Total revenue (all time, paid orders)
      supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
    ]);

    // Calculate today's stats
    const todayOrders = todayOrdersResult.data || [];
    const todayOrderCount = todayOrders.length;
    const todayRevenue = todayOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

    // Pending orders count
    const pendingOrderCount = pendingOrdersResult.count || 0;

    // This month's stats
    const monthOrders = monthOrdersResult.data || [];
    const monthOrderCount = monthOrders.length;
    const monthRevenue = monthOrders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

    // Low stock products
    const lowStockProducts = (lowStockResult.data || []).filter(
      p => p.stock_quantity <= p.low_stock_threshold
    );

    // Total revenue
    const totalRevenue = (totalRevenueResult.data || [])
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

    // Get order status distribution
    const { data: statusDistribution } = await supabase
      .from('orders')
      .select('order_status');

    const statusCounts = {};
    if (statusDistribution) {
      for (const order of statusDistribution) {
        statusCounts[order.order_status] = (statusCounts[order.order_status] || 0) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        today: {
          orders: todayOrderCount,
          revenue: Math.round(todayRevenue * 100) / 100
        },
        month: {
          orders: monthOrderCount,
          revenue: Math.round(monthRevenue * 100) / 100
        },
        pending_orders: pendingOrderCount,
        total_revenue: Math.round(totalRevenue * 100) / 100,
        low_stock_count: lowStockProducts.length,
        order_status_distribution: statusCounts
      },
      low_stock_products: lowStockProducts,
      recent_orders: recentOrdersResult.data || []
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
