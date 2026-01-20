import { createServerClient } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
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

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();

    // Check if coupon exists
    const { data: existing, error: existingError } = await supabase
      .from('coupons')
      .select('id')
      .eq('id', id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Prepare update data (only include provided fields)
    const updateData = {};
    const allowedFields = [
      'description',
      'discount_type',
      'discount_value',
      'minimum_order_amount',
      'maximum_discount',
      'usage_limit',
      'valid_from',
      'valid_until',
      'is_active'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Validate discount if being updated
    if (updateData.discount_type || updateData.discount_value) {
      const discountType = updateData.discount_type || existing.discount_type;
      const discountValue = updateData.discount_value || existing.discount_value;

      if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
        return NextResponse.json(
          { error: 'Percentage discount must be between 0 and 100' },
          { status: 400 }
        );
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update coupon
    const { data: coupon, error: updateError } = await supabase
      .from('coupons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating coupon:', updateError);
      return NextResponse.json(
        { error: 'Failed to update coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    // Check if coupon exists
    const { data: existing } = await supabase
      .from('coupons')
      .select('id, usage_count')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Don't delete if coupon has been used - deactivate instead
    if (existing.usage_count > 0) {
      const { error: updateError } = await supabase
        .from('coupons')
        .update({ is_active: false })
        .eq('id', id);

      if (updateError) {
        console.error('Error deactivating coupon:', updateError);
        return NextResponse.json(
          { error: 'Failed to deactivate coupon' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Coupon has been used and was deactivated instead of deleted'
      });
    }

    // Delete coupon
    const { error: deleteError } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting coupon:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete coupon' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
