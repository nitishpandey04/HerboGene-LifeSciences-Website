'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, Minus, Plus } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';

// Fallback to static data
import { products as staticProducts } from '@/data/products';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();

        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          // Fallback to static data
          const staticProduct = staticProducts.find(p => p.id.toString() === params.id);
          if (staticProduct) {
            setProduct({
              ...staticProduct,
              in_stock: true,
              low_stock: false,
              stock_quantity: 100
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        // Fallback to static data
        const staticProduct = staticProducts.find(p => p.id.toString() === params.id);
        if (staticProduct) {
          setProduct({
            ...staticProduct,
            in_stock: true,
            low_stock: false,
            stock_quantity: 100
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.stock_quantity || 10)) {
      setQuantity(newQty);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-main">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-primary hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = !product.in_stock;
  const isLowStock = product.low_stock;

  return (
    <div className="bg-background min-h-screen py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-text-muted hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Range
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-[400px] md:h-[600px] bg-gray-50 p-8 flex items-center justify-center">
              <div className="relative h-full w-full">
                <Image
                  src={product.image_path}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <span className="text-secondary font-bold tracking-wide uppercase text-sm mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6">
                <p className="text-3xl font-bold text-text-main">₹{product.price}</p>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <p className="text-xl text-gray-400 line-through">₹{product.mrp}</p>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                      {Math.round((1 - product.price / product.mrp) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="prose prose-stone text-text-muted mb-8">
                <p className="text-lg leading-relaxed">{product.details}</p>
              </div>

              {product.ingredients && (
                <div className="mb-8 p-6 bg-background rounded-xl border border-secondary/20">
                  <h3 className="font-bold text-text-main mb-2">Key Ingredients</h3>
                  <p className="text-text-muted">{product.ingredients}</p>
                </div>
              )}

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stock_quantity || 10)}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {product.stock_quantity && product.stock_quantity < 20 && (
                      <span className="text-sm text-orange-600 ml-2">
                        Only {product.stock_quantity} left
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="flex-1 px-8 py-4 rounded-xl font-bold bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <AddToCartButton
                    product={product}
                    quantity={quantity}
                    className="flex-1 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform active:scale-95"
                  />
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-6">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertCircle size={16} />
                    <span>Currently out of stock</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                    <AlertCircle size={16} />
                    <span>Low stock - Order soon!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    <span>In Stock - Ready to Ship</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
