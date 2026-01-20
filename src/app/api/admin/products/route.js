import { createServerClient } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
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
    const { searchParams } = new URL(request.url);

    // Filters
    const lowStock = searchParams.get('low_stock') === 'true';
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (lowStock) {
      query = query.lte('stock_quantity', 10); // Default low stock threshold
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Add stock status to each product
    const productsWithStatus = products.map(product => ({
      ...product,
      in_stock: product.stock_quantity > 0,
      low_stock: product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold
    }));

    return NextResponse.json({
      success: true,
      products: productsWithStatus
    });
  } catch (error) {
    console.error('Error in admin products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
