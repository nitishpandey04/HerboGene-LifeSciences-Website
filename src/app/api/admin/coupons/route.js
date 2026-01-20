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

    const activeOnly = searchParams.get('active') === 'true';

    let query = supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: coupons, error } = await query;

    if (error) {
      console.error('Error fetching coupons:', error);
      return NextResponse.json(
        { error: 'Failed to fetch coupons' },
        { status: 500 }
      );
    }

    // Add status info to each coupon
    const now = new Date();
    const couponsWithStatus = coupons.map(coupon => {
      const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
      const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
      const isExpired = validUntil && validUntil < now;
      const isNotYetActive = validFrom && validFrom > now;
      const usageLimitReached = coupon.usage_limit && coupon.usage_count >= coupon.usage_limit;

      return {
        ...coupon,
        status: !coupon.is_active
          ? 'inactive'
          : isExpired
            ? 'expired'
            : isNotYetActive
              ? 'scheduled'
              : usageLimitReached
                ? 'exhausted'
                : 'active'
      };
    });

    return NextResponse.json({
      success: true,
      coupons: couponsWithStatus
    });
  } catch (error) {
    console.error('Error in coupons API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    const body = await request.json();

    const {
      code,
      description,
      discount_type,
      discount_value,
      minimum_order_amount,
      maximum_discount,
      usage_limit,
      valid_from,
      valid_until,
      is_active = true
    } = body;

    // Validate required fields
    if (!code || !discount_type || !discount_value) {
      return NextResponse.json(
        { error: 'Code, discount type, and discount value are required' },
        { status: 400 }
      );
    }

    // Validate discount type
    if (!['percentage', 'fixed'].includes(discount_type)) {
      return NextResponse.json(
        { error: 'Discount type must be "percentage" or "fixed"' },
        { status: 400 }
      );
    }

    // Validate discount value
    if (discount_type === 'percentage' && (discount_value <= 0 || discount_value > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      );
    }

    if (discount_type === 'fixed' && discount_value <= 0) {
      return NextResponse.json(
        { error: 'Fixed discount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const { data: existing } = await supabase
      .from('coupons')
      .select('id')
      .eq('code', code.toUpperCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    // Create coupon
    const couponData = {
      code: code.toUpperCase().trim(),
      description: description?.trim() || null,
      discount_type,
      discount_value,
      minimum_order_amount: minimum_order_amount || 0,
      maximum_discount: maximum_discount || null,
      usage_limit: usage_limit || null,
      usage_count: 0,
      valid_from: valid_from || new Date().toISOString(),
      valid_until: valid_until || null,
      is_active
    };

    const { data: coupon, error: createError } = await supabase
      .from('coupons')
      .insert(couponData)
      .select()
      .single();

    if (createError) {
      console.error('Error creating coupon:', createError);
      return NextResponse.json(
        { error: 'Failed to create coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
