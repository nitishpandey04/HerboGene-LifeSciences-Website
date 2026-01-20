'use client';

import { useState } from 'react';
import { Tag, X, Loader2, CheckCircle } from 'lucide-react';
import useCheckoutStore from '@/store/useCheckoutStore';
import useCartStore from '@/store/useCartStore';

export default function CouponInput() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { coupon, discountAmount, setCoupon, clearCoupon } = useCheckoutStore();
  const cartTotal = useCartStore((state) => state.cartTotal());

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          subtotal: cartTotal
        })
      });

      const data = await response.json();

      if (!data.valid) {
        setError(data.error || 'Invalid coupon code');
        return;
      }

      setCoupon(data.coupon, data.discount_amount);
      setSuccess(data.message);
      setCode('');
    } catch (err) {
      setError('Failed to validate coupon. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    clearCoupon();
    setSuccess('');
    setError('');
  };

  if (coupon) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          Coupon Applied
        </h2>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">{coupon.code}</p>
              <p className="text-sm text-green-600">
                You save ₹{discountAmount.toFixed(2)}!
              </p>
            </div>
          </div>

          <button
            onClick={handleRemove}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Remove coupon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-primary" />
        Have a Coupon?
      </h2>

      <div className="flex gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError('');
          }}
          placeholder="Enter coupon code"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary uppercase"
          disabled={isLoading}
        />
        <button
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Applying</span>
            </>
          ) : (
            'Apply'
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="mt-2 text-sm text-green-600">{success}</p>
      )}

      <div className="mt-4 text-sm text-text-muted">
        <p>Try these codes: <span className="font-mono text-primary">WELCOME10</span>, <span className="font-mono text-primary">FLAT50</span></p>
      </div>
    </div>
  );
}
