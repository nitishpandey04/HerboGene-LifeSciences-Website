import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    // Optional filters
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock');

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (inStock === 'true') {
      query = query.gt('stock_quantity', 0);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Add stock status to each product
    const productsWithStatus = products.map(product => ({
      ...product,
      in_stock: product.stock_quantity > 0,
      low_stock: product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold
    }));

    return NextResponse.json({
      success: true,
      products: productsWithStatus
    });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
