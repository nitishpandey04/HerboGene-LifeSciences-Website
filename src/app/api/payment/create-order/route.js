import { createServerClient } from '@/lib/supabase';
import { createRazorpayOrder } from '@/lib/razorpay';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if payment method is Razorpay
    if (order.payment_method !== 'razorpay') {
      return NextResponse.json(
        { error: 'Order is not set for online payment' },
        { status: 400 }
      );
    }

    // Check if already paid
    if (order.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      );
    }

    // Check if Razorpay order already exists and is not failed
    if (order.razorpay_order_id && order.payment_status !== 'failed') {
      // Return existing Razorpay order
      return NextResponse.json({
        success: true,
        razorpay_order_id: order.razorpay_order_id,
        amount: order.total_amount,
        currency: 'INR',
        order_number: order.order_number
      });
    }

    // Create new Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: order.total_amount,
      currency: 'INR',
      receipt: order.order_number,
      notes: {
        order_id: order.id,
        order_number: order.order_number,
        customer_email: order.customer_email
      }
    });

    // Update order with Razorpay order ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        razorpay_order_id: razorpayOrder.id,
        payment_status: 'pending'
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Error updating order with Razorpay ID:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      razorpay_order_id: razorpayOrder.id,
      amount: order.total_amount,
      currency: 'INR',
      order_number: order.order_number,
      customer: {
        name: `${order.customer_first_name} ${order.customer_last_name}`,
        email: order.customer_email,
        phone: order.customer_phone
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
