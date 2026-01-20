import { createServerClient } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';
import { sendShippingUpdate } from '@/lib/email';
import { NextResponse } from 'next/server';

const VALID_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export async function PATCH(request, { params }) {
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
    const { id } = await params;
    const { status, tracking_number, shipping_carrier } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Fetch current order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      order_status: status
    };

    // Add timestamps for specific status changes
    if (status === 'shipped') {
      updateData.shipped_at = new Date().toISOString();
      if (tracking_number) {
        updateData.tracking_number = tracking_number;
      }
      if (shipping_carrier) {
        updateData.shipping_carrier = shipping_carrier;
      }
    }

    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    // If cancelling, restore stock
    if (status === 'cancelled' && order.order_status !== 'cancelled') {
      // Only restore if order was confirmed and stock was deducted
      if (['confirmed', 'processing', 'shipped'].includes(order.order_status)) {
        // Fetch order items
        const { data: items } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', id);

        if (items) {
          for (const item of items) {
            // Get current stock
            const { data: product } = await supabase
              .from('products')
              .select('stock_quantity')
              .eq('id', item.product_id)
              .single();

            if (product) {
              await supabase
                .from('products')
                .update({ stock_quantity: product.stock_quantity + item.quantity })
                .eq('id', item.product_id);
            }
          }
        }
      }
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Send email notification for shipped status
    if (status === 'shipped') {
      await sendShippingUpdate({
        ...order,
        ...updateData
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        id: order.id,
        order_number: order.order_number,
        order_status: status
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
