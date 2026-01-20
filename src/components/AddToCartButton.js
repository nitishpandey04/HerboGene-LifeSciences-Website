'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '@/store/useCartStore';

export default function AddToCartButton({ product, quantity = 1, className = '' }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.in_stock === false;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart(product, quantity);
    setIsAdded(true);
    openCart();
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed ${className}`}
      >
        <ShoppingCart size={20} />
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`
        flex items-center justify-center gap-2 transition-all duration-300
        ${className}
        ${isAdded
          ? 'bg-green-600 text-white'
          : 'bg-primary text-white hover:bg-green-800'
        }
      `}
    >
      <ShoppingCart size={20} />
      {isAdded ? 'Added to Cart' : quantity > 1 ? `Add ${quantity} to Cart` : 'Add to Cart'}
    </button>
  );
}
