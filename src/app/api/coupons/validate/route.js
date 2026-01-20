import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!subtotal || subtotal <= 0) {
      return NextResponse.json(
        { error: 'Valid subtotal is required' },
        { status: 400 }
      );
    }

    // Fetch the coupon
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid coupon code'
      });
    }

    // Check if coupon is within valid date range
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon is not yet active'
      });
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon has expired'
      });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon has reached its usage limit'
      });
    }

    // Check minimum order amount
    if (coupon.minimum_order_amount && subtotal < coupon.minimum_order_amount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of ₹${coupon.minimum_order_amount} required for this coupon`
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
      // Apply maximum discount cap if set
      if (coupon.maximum_discount && discount > coupon.maximum_discount) {
        discount = coupon.maximum_discount;
      }
    } else {
      // Fixed discount
      discount = coupon.discount_value;
    }

    // Ensure discount doesn't exceed subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        minimum_order_amount: coupon.minimum_order_amount,
        maximum_discount: coupon.maximum_discount
      },
      discount_amount: Math.round(discount * 100) / 100,
      message: coupon.discount_type === 'percentage'
        ? `${coupon.discount_value}% discount applied!`
        : `₹${coupon.discount_value} discount applied!`
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
