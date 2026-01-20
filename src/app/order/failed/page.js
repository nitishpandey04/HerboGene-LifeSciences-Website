'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, Phone, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const errorMessage = searchParams.get('error');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-serif font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-text-muted mb-6">
          {errorMessage
            ? decodeURIComponent(errorMessage)
            : "We couldn't process your payment. Please try again."}
        </p>

        {/* What went wrong */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 text-left">
          <h2 className="font-semibold text-text-main mb-4">What might have happened?</h2>
          <ul className="space-y-3 text-text-muted">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <span>Insufficient funds in your account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <span>Card was declined by your bank</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <span>Network error during transaction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <span>Payment session expired</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/checkout"
            className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Link>

          <div className="flex gap-4">
            <Link
              href="/products"
              className="flex-1 bg-white text-primary py-3 px-4 rounded-lg font-medium border border-primary hover:bg-primary/5 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/contact"
              className="flex-1 bg-white text-text-main py-3 px-4 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-text-muted">
          If the amount was deducted from your account, it will be refunded within 5-7 business days.
          For any concerns, please contact us at <a href="mailto:support@herbogene.com" className="text-primary hover:underline">support@herbogene.com</a>
        </p>
      </div>
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FailedContent />
    </Suspense>
  );
}
