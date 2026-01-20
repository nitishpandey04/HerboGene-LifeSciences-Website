import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

export function getRazorpayInstance() {
  if (!razorpayInstance) {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }

  return razorpayInstance;
}

// Create a Razorpay order
export async function createRazorpayOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  const razorpay = getRazorpayInstance();

  const options = {
    amount: Math.round(amount * 100), // Razorpay expects amount in paise
    currency,
    receipt,
    notes
  };

  return razorpay.orders.create(options);
}

// Verify Razorpay payment signature
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error('Razorpay key secret not configured');
  }

  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

// Verify Razorpay webhook signature
export function verifyWebhookSignature(body, signature) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('Razorpay webhook secret not configured');
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

// Fetch payment details
export async function fetchPayment(paymentId) {
  const razorpay = getRazorpayInstance();
  return razorpay.payments.fetch(paymentId);
}

// Fetch order details
export async function fetchOrder(orderId) {
  const razorpay = getRazorpayInstance();
  return razorpay.orders.fetch(orderId);
}
