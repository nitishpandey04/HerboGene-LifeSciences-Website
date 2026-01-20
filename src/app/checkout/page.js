'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ShoppingBag, User, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import useCartStore from '@/store/useCartStore';
import useCheckoutStore from '@/store/useCheckoutStore';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderReview from '@/components/checkout/OrderReview';
import PaymentSelector from '@/components/checkout/PaymentSelector';
import CouponInput from '@/components/checkout/CouponInput';

const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 50;

const steps = [
  { id: 1, name: 'Details', icon: User },
  { id: 2, name: 'Payment', icon: CreditCard }
];

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const cart = useCartStore((state) => state.cart);
  const cartTotal = useCartStore((state) => state.cartTotal());
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    customer,
    coupon,
    discountAmount,
    paymentMethod,
    currentStep,
    setCurrentStep,
    reset: resetCheckout
  } = useCheckoutStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate totals
  const subtotal = cartTotal;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round(taxableAmount * GST_RATE * 100) / 100;
  const total = taxableAmount + gstAmount + shippingCost;

  const handleNextStep = () => {
    setCurrentStep(2);
    setError('');
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const createOrder = async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        coupon_code: coupon?.code || null,
        discount_amount: discountAmount,
        payment_method: paymentMethod
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create order');
    }

    return data.order;
  };

  const initiateRazorpayPayment = async (order) => {
    // Create Razorpay order
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create payment order');
    }

    // Open Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(data.amount * 100),
      currency: data.currency,
      name: 'HerboGene LifeSciences',
      description: `Order #${data.order_number}`,
      order_id: data.razorpay_order_id,
      prefill: {
        name: data.customer?.name || `${customer.first_name} ${customer.last_name}`,
        email: data.customer?.email || customer.email,
        contact: data.customer?.phone || customer.phone
      },
      theme: {
        color: '#166534'
      },
      handler: async function (response) {
        // Verify payment
        try {
          setIsProcessing(true);
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            clearCart();
            resetCheckout();
            router.push(`/order/success/${order.id}`);
          } else {
            throw new Error(verifyData.error || 'Payment verification failed');
          }
        } catch (err) {
          setError(err.message || 'Payment verification failed');
          router.push(`/order/failed?order=${order.id}&error=${encodeURIComponent(err.message)}`);
        } finally {
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          setError('Payment was cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response) {
      setIsProcessing(false);
      setError(response.error.description || 'Payment failed');
      router.push(`/order/failed?order=${order.id}&error=${encodeURIComponent(response.error.description)}`);
    });
    razorpay.open();
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const order = await createOrder();

      if (paymentMethod === 'cod') {
        // COD order - redirect to success
        clearCart();
        resetCheckout();
        router.push(`/order/success/${order.id}`);
      } else {
        // Online payment - initiate Razorpay
        if (!razorpayLoaded) {
          throw new Error('Payment gateway not loaded. Please refresh the page.');
        }
        await initiateRazorpayPayment(order);
      }
    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || 'Failed to process order');
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-4">Your cart is empty</h1>
        <p className="text-text-muted mb-6">Add some products to checkout</p>
        <Link
          href="/products"
          className="text-primary hover:text-primary/80 flex items-center gap-2 font-medium"
        >
          <ArrowLeft size={20} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />

      <div className="bg-background min-h-screen py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-primary">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => isCompleted && setCurrentStep(step.id)}
                      disabled={!isCompleted}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full transition-all
                        ${isActive
                          ? 'bg-primary text-white'
                          : isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <StepIcon className="w-5 h-5" />
                      <span className="font-medium">{step.name}</span>
                    </button>

                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          isCompleted ? 'bg-green-300' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {currentStep === 1 && (
                <CheckoutForm onNext={handleNextStep} />
              )}

              {currentStep === 2 && (
                <>
                  <OrderReview onBack={handlePrevStep} />
                  <CouponInput />
                  <PaymentSelector />

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : paymentMethod === 'cod' ? (
                      `Place Order - ₹${total.toFixed(2)}`
                    ) : (
                      `Pay Now - ₹${total.toFixed(2)}`
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Right Column - Order Summary (sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-text-muted">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-text-main">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-text-muted">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {shippingCost > 0 && (
                  <p className="mt-4 text-xs text-text-muted bg-yellow-50 border border-yellow-200 rounded p-2">
                    Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-text-muted text-center">
                    Secure checkout powered by Razorpay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
