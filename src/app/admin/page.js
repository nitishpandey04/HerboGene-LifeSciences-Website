'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, DollarSign, Package, AlertTriangle,
  TrendingUp, Clock, CheckCircle, Loader2, ArrowRight
} from 'lucide-react';

function StatsCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data);
        } else {
          setError(data.error || 'Failed to load dashboard');
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const { stats: s, low_stock_products, recent_orders } = stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Orders"
          value={s.today.orders}
          subtitle={`₹${s.today.revenue.toLocaleString()} revenue`}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Pending Orders"
          value={s.pending_orders}
          subtitle="Awaiting processing"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${s.month.revenue.toLocaleString()}`}
          subtitle={`${s.month.orders} orders this month`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Low Stock Items"
          value={s.low_stock_count}
          subtitle="Need restocking"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recent_orders.length === 0 ? (
              <p className="p-6 text-center text-gray-500">No orders yet</p>
            ) : (
              recent_orders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer_first_name} {order.customer_last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.total_amount}</p>
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full font-medium
                      ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.order_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'}
                    `}>
                      {order.order_status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Low Stock Alert</h2>
            <Link href="/admin/products" className="text-sm text-primary hover:underline flex items-center gap-1">
              Manage Stock <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {low_stock_products.length === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">All products are well stocked!</p>
              </div>
            ) : (
              low_stock_products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Threshold: {product.low_stock_threshold}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`
                      font-bold text-lg
                      ${product.stock_quantity === 0 ? 'text-red-600' : 'text-orange-600'}
                    `}>
                      {product.stock_quantity}
                    </span>
                    <p className="text-xs text-gray-500">in stock</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      {s.order_status_distribution && Object.keys(s.order_status_distribution).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Order Status Overview</h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(s.order_status_distribution).map(([status, count]) => (
              <div
                key={status}
                className={`
                  px-4 py-2 rounded-lg border
                  ${status === 'delivered' ? 'bg-green-50 border-green-200' :
                    status === 'shipped' ? 'bg-blue-50 border-blue-200' :
                    status === 'cancelled' ? 'bg-red-50 border-red-200' :
                    status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'}
                `}
              >
                <span className="capitalize font-medium">{status}</span>
                <span className="ml-2 font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
