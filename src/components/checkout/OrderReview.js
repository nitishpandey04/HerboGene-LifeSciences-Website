'use client';

import Image from 'next/image';
import { Package, MapPin, User, CreditCard, Truck } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import useCheckoutStore from '@/store/useCheckoutStore';

const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

export default function OrderReview({ onBack }) {
  const cart = useCartStore((state) => state.cart);
  const cartTotal = useCartStore((state) => state.cartTotal());
  const { customer, discountAmount, coupon } = useCheckoutStore();

  const subtotal = cartTotal;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount * GST_RATE * 100) / 100;
  const total = taxableAmount + gstAmount + shippingCost;

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-text-main mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Order Items ({cart.length})
        </h2>

        <div className="divide-y divide-gray-100">
          {cart.map((item) => (
            <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={item.image_path}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-main truncate">{item.name}</h3>
                <p className="text-sm text-text-muted mt-1">Qty: {item.quantity}</p>
                <p className="text-primary font-semibold mt-1">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-main flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Shipping Address
          </h2>
          <button
            onClick={onBack}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Edit
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="font-medium text-text-main">
            {customer.first_name} {customer.last_name}
          </p>
          <p className="text-text-muted mt-1">{customer.address}</p>
          <p className="text-text-muted">
            {customer.city}, {customer.state} - {customer.pincode}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
            <p className="text-sm text-text-muted flex items-center gap-2">
              <User className="w-4 h-4" />
              {customer.email}
            </p>
            <p className="text-sm text-text-muted flex items-center gap-2">
              <User className="w-4 h-4" />
              +91 {customer.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-text-main mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Price Summary
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between text-text-muted">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount {coupon && `(${coupon.code})`}</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-text-muted">
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Shipping
            </span>
            <span className={shippingCost === 0 ? 'text-green-600' : ''}>
              {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span>GST (18%)</span>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-semibold text-text-main">
            <span>Total</span>
            <span className="text-primary">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {shippingCost > 0 && (
          <p className="mt-4 text-sm text-text-muted bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more to get free shipping!
          </p>
        )}
      </div>
    </div>
  );
}
