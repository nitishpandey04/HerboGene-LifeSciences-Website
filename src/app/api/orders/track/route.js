import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    const orderNumber = searchParams.get('order');
    const email = searchParams.get('email');

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Order number and email are required' },
        { status: 400 }
      );
    }

    // Fetch order matching both order number and email
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber.toUpperCase())
      .eq('customer_email', email.toLowerCase())
      .single();

    if (orderError || !order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found. Please check your order number and email address.'
      });
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('product_name, product_price, quantity, subtotal')
      .eq('order_id', order.id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
    }

    // Prepare tracking timeline
    const timeline = [];

    // Order placed
    timeline.push({
      status: 'Order Placed',
      date: order.created_at,
      completed: true
    });

    // Order confirmed
    if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.order_status)) {
      timeline.push({
        status: 'Order Confirmed',
        date: order.created_at,
        completed: true
      });
    } else {
      timeline.push({
        status: 'Order Confirmed',
        date: null,
        completed: false
      });
    }

    // Processing
    if (['processing', 'shipped', 'delivered'].includes(order.order_status)) {
      timeline.push({
        status: 'Processing',
        date: order.updated_at,
        completed: true
      });
    } else {
      timeline.push({
        status: 'Processing',
        date: null,
        completed: order.order_status === 'confirmed' ? false : false
      });
    }

    // Shipped
    if (['shipped', 'delivered'].includes(order.order_status)) {
      timeline.push({
        status: 'Shipped',
        date: order.shipped_at || order.updated_at,
        completed: true
      });
    } else {
      timeline.push({
        status: 'Shipped',
        date: null,
        completed: false
      });
    }

    // Delivered
    if (order.order_status === 'delivered') {
      timeline.push({
        status: 'Delivered',
        date: order.delivered_at || order.updated_at,
        completed: true
      });
    } else {
      timeline.push({
        status: 'Delivered',
        date: null,
        completed: false
      });
    }

    // Return sanitized order data (no sensitive info)
    return NextResponse.json({
      success: true,
      order: {
        order_number: order.order_number,
        order_status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        subtotal: order.subtotal,
        discount_amount: order.discount_amount,
        shipping_cost: order.shipping_cost,
        gst_amount: order.gst_amount,
        total_amount: order.total_amount,
        tracking_number: order.tracking_number,
        shipping_carrier: order.shipping_carrier,
        created_at: order.created_at,
        shipped_at: order.shipped_at,
        delivered_at: order.delivered_at,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        shipping_pincode: order.shipping_pincode,
        items: items || []
      },
      timeline: timeline
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
