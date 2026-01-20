'use client';

import { CreditCard, Banknote, CheckCircle } from 'lucide-react';
import useCheckoutStore from '@/store/useCheckoutStore';

const paymentMethods = [
  {
    id: 'razorpay',
    name: 'Pay Online',
    description: 'UPI, Credit/Debit Card, Net Banking, Wallets',
    icon: CreditCard,
    recommended: true
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: Banknote,
    recommended: false
  }
];

export default function PaymentSelector() {
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-text-main mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary" />
        Payment Method
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = paymentMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                flex items-center gap-4
                ${isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
                `}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-text-main'}`}>
                    {method.name}
                  </span>
                  {method.recommended && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted mt-0.5">{method.description}</p>
              </div>

              <div
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}
                `}
              >
                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {paymentMethod === 'razorpay' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Secure Payment:</strong> You will be redirected to Razorpay secure payment gateway to complete your payment.
          </p>
        </div>
      )}

      {paymentMethod === 'cod' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Please keep the exact amount ready at the time of delivery.
          </p>
        </div>
      )}
    </div>
  );
}
