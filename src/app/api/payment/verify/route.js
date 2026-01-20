import { createServerClient } from '@/lib/supabase';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { sendOrderConfirmation } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      // Update order payment status to failed
      await supabase
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', order_id);

      return NextResponse.json(
        { error: 'Payment verification failed' },
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

    // Fetch order items for stock deduction
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', order_id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
    }

    // Deduct stock for each item
    if (orderItems) {
      for (const item of orderItems) {
        // Get current stock
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();

        if (product) {
          const newStock = Math.max(0, product.stock_quantity - item.quantity);
          await supabase
            .from('products')
            .update({ stock_quantity: newStock })
            .eq('id', item.product_id);
        }
      }
    }

    // Update coupon usage if used
    if (order.coupon_code) {
      await supabase
        .from('coupons')
        .update({ usage_count: supabase.raw('usage_count + 1') })
        .eq('code', order.coupon_code);
    }

    // Update order with payment details
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'confirmed',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Fetch order items for email
    const { data: items } = await supabase
      .from('order_items')
      .select('product_name, product_price, quantity, subtotal')
      .eq('order_id', order_id);

    // Send confirmation email
    const orderWithItems = {
      ...order,
      payment_status: 'paid',
      order_status: 'confirmed',
      items: items || []
    };
    await sendOrderConfirmation(orderWithItems);

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        id: order.id,
        order_number: order.order_number,
        payment_status: 'paid',
        order_status: 'confirmed'
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
