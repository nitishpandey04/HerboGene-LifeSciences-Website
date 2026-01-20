'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Package, MapPin, Truck, CheckCircle, Clock, Search,
  Loader2, AlertCircle, Mail, ArrowRight
} from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get('order') || '';
  const initialEmail = searchParams.get('email') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const trackOrder = async (orderNum, emailAddr) => {
    if (!orderNum.trim() || !emailAddr.trim()) {
      setError('Please enter both order number and email');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(
        `/api/orders/track?order=${encodeURIComponent(orderNum)}&email=${encodeURIComponent(emailAddr)}`
      );
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
        setTimeline(data.timeline || []);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-track if params provided
  useEffect(() => {
    if (initialOrder && initialEmail) {
      trackOrder(initialOrder, initialEmail);
    }
  }, [initialOrder, initialEmail]);

  const handleTrack = (e) => {
    if (e) e.preventDefault();
    trackOrder(orderNumber, email);
  };

  const getStatusIcon = (status, completed) => {
    const iconProps = {
      className: `w-5 h-5 ${completed ? 'text-green-600' : 'text-gray-300'}`
    };

    switch (status) {
      case 'Order Placed':
        return <Package {...iconProps} />;
      case 'Order Confirmed':
        return <CheckCircle {...iconProps} />;
      case 'Processing':
        return <Clock {...iconProps} />;
      case 'Shipped':
        return <Truck {...iconProps} />;
      case 'Delivered':
        return <MapPin {...iconProps} />;
      default:
        return <Package {...iconProps} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Track Your Order</h1>
          <p className="text-text-muted">
            Enter your order details to see the current status
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Order Number
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="HG-2024-XXXXX"
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </div>
        </form>

        {/* Order Status */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-text-muted">Order Number</p>
                  <p className="text-xl font-bold text-primary">{order.order_number}</p>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-sm font-medium capitalize
                  ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    order.order_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'}
                `}>
                  {order.order_status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted">Payment</p>
                  <p className="font-medium text-text-main capitalize">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid'}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted">Total</p>
                  <p className="font-medium text-text-main">₹{order.total_amount}</p>
                </div>
              </div>

              {order.tracking_number && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-text-muted">Tracking Number</p>
                  <p className="font-medium text-text-main">{order.tracking_number}</p>
                  {order.shipping_carrier && (
                    <p className="text-sm text-text-muted">via {order.shipping_carrier}</p>
                  )}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-text-main mb-6">Order Timeline</h2>

              <div className="relative">
                {timeline.map((step, index) => (
                  <div key={index} className="flex gap-4 pb-8 last:pb-0">
                    {/* Line */}
                    {index < timeline.length - 1 && (
                      <div
                        className={`absolute left-[17px] w-0.5 h-full -z-10 ${
                          step.completed ? 'bg-green-200' : 'bg-gray-200'
                        }`}
                        style={{ top: `${index * 80 + 35}px`, height: '60px' }}
                      />
                    )}

                    {/* Icon */}
                    <div className={`
                      w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                      ${step.completed ? 'bg-green-100' : 'bg-gray-100'}
                    `}>
                      {getStatusIcon(step.status, step.completed)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-text-main' : 'text-gray-400'}`}>
                        {step.status}
                      </p>
                      <p className={`text-sm ${step.completed ? 'text-text-muted' : 'text-gray-300'}`}>
                        {formatDate(step.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-text-main mb-4">Items in this Order</h2>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item, index) => (
                  <div key={index} className="py-3 flex justify-between first:pt-0 last:pb-0">
                    <div>
                      <p className="font-medium text-text-main">{item.product_name}</p>
                      <p className="text-sm text-text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-text-main">₹{item.subtotal}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Address
              </h2>
              <p className="text-text-muted">
                {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
              </p>
            </div>
          </div>
        )}

        {/* Help Link */}
        <div className="mt-8 text-center">
          <p className="text-text-muted">
            Need help with your order?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderTrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
