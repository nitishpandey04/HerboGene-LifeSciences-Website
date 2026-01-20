import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = createServerClient();
    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Get all product IDs from cart
    const productIds = items.map(item => item.id);

    // Fetch current product data from database
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, is_active')
      .in('id', productIds);

    if (error) {
      console.error('Error validating cart:', error);
      return NextResponse.json(
        { error: 'Failed to validate cart' },
        { status: 500 }
      );
    }

    // Create a map for quick lookup
    const productMap = new Map(products.map(p => [p.id, p]));

    const validatedItems = [];
    const errors = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.id);

      if (!product) {
        errors.push({
          id: item.id,
          name: item.name,
          error: 'Product no longer available'
        });
        continue;
      }

      if (!product.is_active) {
        errors.push({
          id: item.id,
          name: product.name,
          error: 'Product is currently unavailable'
        });
        continue;
      }

      if (product.stock_quantity <= 0) {
        errors.push({
          id: item.id,
          name: product.name,
          error: 'Product is out of stock'
        });
        continue;
      }

      if (item.quantity > product.stock_quantity) {
        errors.push({
          id: item.id,
          name: product.name,
          error: `Only ${product.stock_quantity} items available`,
          available_quantity: product.stock_quantity
        });
        continue;
      }

      // Item is valid
      const itemSubtotal = product.price * item.quantity;
      validatedItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        stock_quantity: product.stock_quantity,
        // Flag if price changed
        price_changed: product.price !== item.price
      });
      subtotal += itemSubtotal;
    }

    const hasErrors = errors.length > 0;
    const hasPriceChanges = validatedItems.some(item => item.price_changed);

    return NextResponse.json({
      success: !hasErrors,
      valid: !hasErrors,
      items: validatedItems,
      errors: errors,
      subtotal: subtotal,
      has_price_changes: hasPriceChanges,
      message: hasErrors
        ? 'Some items in your cart need attention'
        : hasPriceChanges
          ? 'Some prices have been updated'
          : 'Cart is valid'
    });
  } catch (error) {
    console.error('Error in cart validation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
