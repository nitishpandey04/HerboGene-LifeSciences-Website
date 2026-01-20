'use client';

import { useState, useEffect } from 'react';
import { Loader2, Filter } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import ProductCard from '@/components/ProductCard';

// Fallback to static data if API fails
import { products as staticProducts } from '@/data/products';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.success && data.products) {
          setProducts(data.products);
        } else {
          // Fallback to static data
          setProducts(staticProducts.map(p => ({
            ...p,
            in_stock: true,
            low_stock: false,
            stock_quantity: 100
          })));
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // Fallback to static data
        setProducts(staticProducts.map(p => ({
          ...p,
          in_stock: true,
          low_stock: false,
          stock_quantity: 100
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="bg-background min-h-screen py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Premium Product Range"
          subtitle="Crafted for Wellness"
        />
        <div className="text-center max-w-3xl mx-auto mb-12 text-text-muted">
          <p>
            At HerboGene LifeSciences, we pride ourselves on offering a diverse range of premium quality herbal and nutraceutical medicines. Each product is crafted with the utmost care and precision, adhering to the highest standards of quality and safety.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          <Filter className="w-5 h-5 text-text-muted" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-muted hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
