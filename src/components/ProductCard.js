'use client';

import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '@/store/useCartStore';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.in_stock === false;
  const isLowStock = product.low_stock === true;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative">
        {/* Image Section */}
        <div className="relative h-64 w-full bg-gray-50 p-6 overflow-hidden">
          <Image
            className={`object-contain group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'opacity-50' : ''}`}
            src={product.image_path}
            fill
            alt={product.name}
          />
          <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            {product.category || 'PREMIUM'}
          </div>

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
              Out of Stock
            </div>
          )}

          {/* Low Stock Badge */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg flex items-center gap-1">
              <AlertCircle size={12} />
              Low Stock
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-text-main font-serif group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="text-right">
              <span className="font-bold text-primary">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="block text-xs text-gray-400 line-through">₹{product.mrp}</span>
              )}
            </div>
          </div>
          <p className="text-text-muted text-sm flex-grow line-clamp-3">
            {product.description}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`
              mt-4 w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
              ${isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isAdded
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-primary text-primary hover:bg-primary hover:text-white'
              }
            `}
          >
            <ShoppingCart size={16} />
            {isOutOfStock ? 'Out of Stock' : isAdded ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
