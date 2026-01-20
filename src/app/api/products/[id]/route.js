import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    // Try to fetch by ID first, then by slug
    let query;
    if (!isNaN(id)) {
      query = supabase
        .from('products')
        .select('*')
        .eq('id', parseInt(id))
        .eq('is_active', true)
        .single();
    } else {
      query = supabase
        .from('products')
        .select('*')
        .eq('slug', id)
        .eq('is_active', true)
        .single();
    }

    const { data: product, error } = await query;

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add stock status
    const productWithStatus = {
      ...product,
      in_stock: product.stock_quantity > 0,
      low_stock: product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold
    };

    return NextResponse.json({
      success: true,
      product: productWithStatus
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
