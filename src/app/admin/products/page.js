'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search, Package, Loader2, AlertTriangle, CheckCircle,
  Edit2, Save, X
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditValues({
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
      is_active: product.is_active
    });
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = async (productId) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/admin/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues)
      });

      const data = await response.json();

      if (data.success) {
        setProducts(products.map(p =>
          p.id === productId ? { ...p, ...editValues } : p
        ));
        setMessage({ type: 'success', text: 'Product updated successfully' });
        setEditingId(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update product' });
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'low_stock') return p.stock_quantity <= p.low_stock_threshold;
    if (filter === 'out_of_stock') return p.stock_quantity === 0;
    if (filter === 'inactive') return !p.is_active;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500">Manage product stock and availability</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`
          p-4 rounded-lg flex items-center gap-2
          ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}
        `}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'All Products' },
          { value: 'low_stock', label: 'Low Stock' },
          { value: 'out_of_stock', label: 'Out of Stock' },
          { value: 'inactive', label: 'Inactive' }
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${filter === f.value
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
            `}
          >
            {f.label}
            {f.value === 'low_stock' && (
              <span className="ml-1">({products.filter(p => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0).length})</span>
            )}
            {f.value === 'out_of_stock' && (
              <span className="ml-1">({products.filter(p => p.stock_quantity === 0).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Threshold</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const isEditing = editingId === product.id;
                const isLowStock = product.stock_quantity <= product.low_stock_threshold;
                const isOutOfStock = product.stock_quantity === 0;

                return (
                  <tr key={product.id} className={`hover:bg-gray-50 ${!product.is_active ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image_path}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">₹{product.price}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editValues.stock_quantity}
                          onChange={(e) => setEditValues({ ...editValues, stock_quantity: parseInt(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 border border-gray-200 rounded text-center"
                        />
                      ) : (
                        <span className={`
                          font-bold text-lg
                          ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}
                        `}>
                          {product.stock_quantity}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editValues.low_stock_threshold}
                          onChange={(e) => setEditValues({ ...editValues, low_stock_threshold: parseInt(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 border border-gray-200 rounded text-center"
                        />
                      ) : (
                        <span className="text-gray-500">{product.low_stock_threshold}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <select
                          value={editValues.is_active ? 'active' : 'inactive'}
                          onChange={(e) => setEditValues({ ...editValues, is_active: e.target.value === 'active' })}
                          className="px-2 py-1 border border-gray-200 rounded"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                        `}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSave(product.id)}
                            disabled={saving}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
