'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Package, MapPin, Mail, Phone, Loader2, ArrowRight, Copy, Check } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const copyOrderNumber = () => {
    if (order?.order_number) {
      navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-text-main mb-4">Order Not Found</h1>
        <p className="text-text-muted mb-6">{error}</p>
        <Link
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Order Confirmed!</h1>
          <p className="text-text-muted">
            Thank you for your order. We&apos;ve sent a confirmation to your email.
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Order Number</p>
              <p className="text-2xl font-bold text-primary">{order.order_number}</p>
            </div>
            <button
              onClick={copyOrderNumber}
              className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              title="Copy order number"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-muted">Payment Method</p>
              <p className="font-medium text-text-main">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Status</p>
              <p className="font-medium text-green-600 capitalize">{order.order_status}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Order Items
          </h2>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item, index) => (
              <div key={index} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                <div className="flex-1">
                  <h3 className="font-medium text-text-main">{item.product_name}</h3>
                  <p className="text-sm text-text-muted">
                    ₹{item.product_price} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-text-main">₹{item.subtotal}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between text-text-muted">
              <span>Shipping</span>
              <span>{order.shipping_cost === 0 ? 'FREE' : `₹${order.shipping_cost}`}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>GST</span>
              <span>₹{order.gst_amount}</span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Shipping Address
          </h2>

          <div className="space-y-2">
            <p className="font-medium text-text-main">
              {order.customer_first_name} {order.customer_last_name}
            </p>
            <p className="text-text-muted">{order.shipping_address}</p>
            <p className="text-text-muted">
              {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
            </p>
            <div className="pt-3 mt-3 border-t border-gray-100 space-y-1">
              <p className="text-sm text-text-muted flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {order.customer_email}
              </p>
              <p className="text-sm text-text-muted flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +91 {order.customer_phone}
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-2">Estimated Delivery</h3>
          <p className="text-yellow-700">
            Your order will be delivered within 5-7 business days.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/order/track?order=${order.order_number}&email=${order.customer_email}`}
            className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Track Order
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products"
            className="flex-1 bg-white text-primary py-3 px-6 rounded-lg font-medium text-center border border-primary hover:bg-primary/5 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
