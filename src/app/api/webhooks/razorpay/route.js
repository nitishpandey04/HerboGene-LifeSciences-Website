import { createServerClient } from '@/lib/supabase';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { sendOrderConfirmation, sendPaymentFailed } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createServerClient();

    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    console.log('Razorpay webhook event:', eventType);

    switch (eventType) {
      case 'payment.captured': {
        const payment = payload.payment.entity;
        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        // Find the order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('razorpay_order_id', razorpayOrderId)
          .single();

        if (orderError || !order) {
          console.error('Order not found for Razorpay order:', razorpayOrderId);
          return NextResponse.json({ received: true });
        }

        // Skip if already paid
        if (order.payment_status === 'paid') {
          return NextResponse.json({ received: true });
        }

        // Fetch order items for stock deduction
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', order.id);

        // Deduct stock
        if (orderItems) {
          for (const item of orderItems) {
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

        // Update order
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            order_status: 'confirmed',
            razorpay_payment_id: razorpayPaymentId
          })
          .eq('id', order.id);

        // Fetch items and send email
        const { data: items } = await supabase
          .from('order_items')
          .select('product_name, product_price, quantity, subtotal')
          .eq('order_id', order.id);

        await sendOrderConfirmation({
          ...order,
          payment_status: 'paid',
          order_status: 'confirmed',
          items: items || []
        });

        break;
      }

      case 'payment.failed': {
        const payment = payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        // Find the order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('razorpay_order_id', razorpayOrderId)
          .single();

        if (orderError || !order) {
          console.error('Order not found for Razorpay order:', razorpayOrderId);
          return NextResponse.json({ received: true });
        }

        // Update order
        await supabase
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('id', order.id);

        // Send failure email
        await sendPaymentFailed(order);

        break;
      }

      case 'order.paid': {
        // Alternative event for payment success
        const razorpayOrder = payload.order.entity;
        const razorpayOrderId = razorpayOrder.id;

        // Find the order
        const { data: order } = await supabase
          .from('orders')
          .select('payment_status')
          .eq('razorpay_order_id', razorpayOrderId)
          .single();

        // Only process if not already paid (avoid duplicate processing)
        if (order && order.payment_status !== 'paid') {
          // Let payment.captured handle the full update
          console.log('Order.paid received, waiting for payment.captured');
        }

        break;
      }

      case 'refund.created':
      case 'refund.processed': {
        const refund = payload.refund.entity;
        const paymentId = refund.payment_id;

        // Find the order by payment ID
        const { data: order } = await supabase
          .from('orders')
          .select('id')
          .eq('razorpay_payment_id', paymentId)
          .single();

        if (order) {
          await supabase
            .from('orders')
            .update({ payment_status: 'refunded' })
            .eq('id', order.id);
        }

        break;
      }

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Note: In App Router, request.text() already provides raw body for signature verification
