import { createServerClient, generateOrderNumber } from '@/lib/supabase';
import { sendOrderConfirmation } from '@/lib/email';
import { NextResponse } from 'next/server';

const GST_RATE = 0.18; // 18% GST
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const {
      customer,
      items,
      coupon_code,
      discount_amount = 0,
      payment_method
    } = body;

    // Validate required fields
    if (!customer || !items || items.length === 0 || !payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate customer fields
    const requiredCustomerFields = [
      'first_name', 'last_name', 'email', 'phone',
      'address', 'city', 'state', 'pincode'
    ];

    for (const field of requiredCustomerFields) {
      if (!customer[field]) {
        return NextResponse.json(
          { error: `Customer ${field.replace('_', ' ')} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate phone format (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(customer.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number. Must be 10 digits starting with 6-9' },
        { status: 400 }
      );
    }

    // Validate pincode (6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(customer.pincode)) {
      return NextResponse.json(
        { error: 'Invalid pincode. Must be 6 digits' },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!['razorpay', 'cod'].includes(payment_method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Fetch product details and validate stock
    const productIds = items.map(item => item.id);
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, is_active')
      .in('id', productIds);

    if (productError) {
      console.error('Error fetching products:', productError);
      return NextResponse.json(
        { error: 'Failed to validate products' },
        { status: 500 }
      );
    }

    const productMap = new Map(products.map(p => [p.id, p]));

    // Validate all items have sufficient stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.id);

      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: `Product "${item.name || item.id}" is no longer available` },
          { status: 400 }
        );
      }

      if (product.stock_quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} available.` },
          { status: 400 }
        );
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    // Calculate shipping
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

    // Calculate GST on subtotal after discount
    const taxableAmount = subtotal - discount_amount;
    const gstAmount = Math.round(taxableAmount * GST_RATE * 100) / 100;

    // Calculate total
    const totalAmount = taxableAmount + gstAmount + shippingCost;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create the order
    const orderData = {
      order_number: orderNumber,
      customer_first_name: customer.first_name.trim(),
      customer_last_name: customer.last_name.trim(),
      customer_email: customer.email.toLowerCase().trim(),
      customer_phone: customer.phone.trim(),
      shipping_address: customer.address.trim(),
      shipping_city: customer.city.trim(),
      shipping_state: customer.state.trim(),
      shipping_pincode: customer.pincode.trim(),
      subtotal: subtotal,
      discount_amount: discount_amount,
      coupon_code: coupon_code || null,
      shipping_cost: shippingCost,
      gst_amount: gstAmount,
      total_amount: Math.round(totalAmount * 100) / 100,
      payment_method: payment_method,
      payment_status: payment_method === 'cod' ? 'pending' : 'pending',
      order_status: 'pending'
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Insert order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Attempt to delete the order if items fail
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // If COD, deduct stock immediately and confirm order
    if (payment_method === 'cod') {
      // Deduct stock
      for (const item of items) {
        const product = productMap.get(item.id);
        await supabase
          .from('products')
          .update({ stock_quantity: product.stock_quantity - item.quantity })
          .eq('id', item.id);
      }

      // Update coupon usage if used
      if (coupon_code) {
        await supabase.rpc('increment_coupon_usage', { coupon_code_param: coupon_code });
      }

      // Update order status to confirmed
      await supabase
        .from('orders')
        .update({ order_status: 'confirmed' })
        .eq('id', order.id);

      // Send confirmation email
      const orderWithItems = {
        ...order,
        order_status: 'confirmed',
        items: orderItems
      };
      await sendOrderConfirmation(orderWithItems);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: payment_method === 'cod' ? 'confirmed' : order.order_status
      }
    });
  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
