import { createServerClient } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

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
    const { stock_quantity, is_active, low_stock_threshold } = await request.json();

    // Validate product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {};

    if (stock_quantity !== undefined) {
      if (typeof stock_quantity !== 'number' || stock_quantity < 0) {
        return NextResponse.json(
          { error: 'Invalid stock quantity' },
          { status: 400 }
        );
      }
      updateData.stock_quantity = Math.floor(stock_quantity);
    }

    if (is_active !== undefined) {
      if (typeof is_active !== 'boolean') {
        return NextResponse.json(
          { error: 'Invalid is_active value' },
          { status: 400 }
        );
      }
      updateData.is_active = is_active;
    }

    if (low_stock_threshold !== undefined) {
      if (typeof low_stock_threshold !== 'number' || low_stock_threshold < 0) {
        return NextResponse.json(
          { error: 'Invalid low stock threshold' },
          { status: 400 }
        );
      }
      updateData.low_stock_threshold = Math.floor(low_stock_threshold);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update product
    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: {
        id: product.id,
        name: product.name,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
