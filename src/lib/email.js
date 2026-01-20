import { Resend } from 'resend';

let resendInstance = null;

function getResendInstance() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('Resend API key not configured - emails will be skipped');
      return null;
    }

    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'orders@herbogene.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://herbogene.com';

// Send order confirmation email
export async function sendOrderConfirmation(order) {
  const resend = getResendInstance();
  if (!resend) return { success: false, error: 'Email not configured' };

  const itemsList = order.items
    .map(item => `• ${item.product_name} x ${item.quantity} - ₹${item.subtotal}`)
    .join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        <p style="color: #bbf7d0; margin: 10px 0 0 0;">Thank you for shopping with HerboGene</p>
      </div>

      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
        <p style="margin-top: 0;">Hi ${order.customer_first_name},</p>
        <p>Your order <strong>#${order.order_number}</strong> has been confirmed and is being processed.</p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #166534;">Order Details</h3>
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.order_number}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <p style="margin: 5px 0;"><strong>Order Status:</strong> ${order.order_status}</p>
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #166534;">Items Ordered</h3>
          <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${itemsList}</pre>
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #166534;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;">Subtotal</td>
              <td style="padding: 8px 0; text-align: right;">₹${order.subtotal}</td>
            </tr>
            ${order.discount_amount > 0 ? `
            <tr>
              <td style="padding: 8px 0; color: #16a34a;">Discount${order.coupon_code ? ` (${order.coupon_code})` : ''}</td>
              <td style="padding: 8px 0; text-align: right; color: #16a34a;">-₹${order.discount_amount}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0;">Shipping</td>
              <td style="padding: 8px 0; text-align: right;">${order.shipping_cost === 0 ? 'FREE' : `₹${order.shipping_cost}`}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">GST (18%)</td>
              <td style="padding: 8px 0; text-align: right;">₹${order.gst_amount}</td>
            </tr>
            <tr style="border-top: 2px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: bold; font-size: 18px;">Total</td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px; color: #166534;">₹${order.total_amount}</td>
            </tr>
          </table>
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #166534;">Shipping Address</h3>
          <p style="margin: 0;">
            ${order.customer_first_name} ${order.customer_last_name}<br>
            ${order.shipping_address}<br>
            ${order.shipping_city}, ${order.shipping_state} - ${order.shipping_pincode}<br>
            Phone: ${order.customer_phone}
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${APP_URL}/order/track?order=${order.order_number}&email=${order.customer_email}"
             style="background: #166534; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Track Your Order
          </a>
        </div>

        <p style="color: #64748b; font-size: 14px;">Expected delivery: 5-7 business days</p>
      </div>

      <div style="background: #1c1917; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: #a8a29e; margin: 0; font-size: 14px;">
          Questions? Contact us at support@herbogene.com
        </p>
        <p style="color: #78716c; margin: 10px 0 0 0; font-size: 12px;">
          © ${new Date().getFullYear()} HerboGene LifeSciences. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: `HerboGene Orders <${FROM_EMAIL}>`,
      to: order.customer_email,
      subject: `Order Confirmed - #${order.order_number}`,
      html
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

// Send shipping update email
export async function sendShippingUpdate(order) {
  const resend = getResendInstance();
  if (!resend) return { success: false, error: 'Email not configured' };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shipping Update</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Your Order is on the Way!</h1>
        <p style="color: #bbf7d0; margin: 10px 0 0 0;">Order #${order.order_number}</p>
      </div>

      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
        <p style="margin-top: 0;">Hi ${order.customer_first_name},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #166534;">Tracking Information</h3>
          <p style="margin: 5px 0;"><strong>Carrier:</strong> ${order.shipping_carrier || 'Standard Shipping'}</p>
          <p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${order.tracking_number || 'Will be updated soon'}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${APP_URL}/order/track?order=${order.order_number}&email=${order.customer_email}"
             style="background: #166534; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Track Your Order
          </a>
        </div>

        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; color: #166534;">Delivery Address</h3>
          <p style="margin: 0;">
            ${order.customer_first_name} ${order.customer_last_name}<br>
            ${order.shipping_address}<br>
            ${order.shipping_city}, ${order.shipping_state} - ${order.shipping_pincode}
          </p>
        </div>
      </div>

      <div style="background: #1c1917; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: #a8a29e; margin: 0; font-size: 14px;">
          Questions? Contact us at support@herbogene.com
        </p>
        <p style="color: #78716c; margin: 10px 0 0 0; font-size: 12px;">
          © ${new Date().getFullYear()} HerboGene LifeSciences. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: `HerboGene Orders <${FROM_EMAIL}>`,
      to: order.customer_email,
      subject: `Your Order Has Shipped - #${order.order_number}`,
      html
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending shipping update email:', error);
    return { success: false, error: error.message };
  }
}

// Send payment failed email
export async function sendPaymentFailed(order) {
  const resend = getResendInstance();
  if (!resend) return { success: false, error: 'Email not configured' };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Payment Failed</h1>
        <p style="color: #fecaca; margin: 10px 0 0 0;">Order #${order.order_number}</p>
      </div>

      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
        <p style="margin-top: 0;">Hi ${order.customer_first_name},</p>
        <p>Unfortunately, we couldn't process your payment for order #${order.order_number}.</p>

        <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #fecaca;">
          <p style="margin: 0; color: #991b1b;">
            This could be due to insufficient funds, card declined, or a temporary issue with your payment method.
          </p>
        </div>

        <p>Don't worry! Your cart items are still saved. You can try again with a different payment method.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${APP_URL}/checkout"
             style="background: #166534; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Retry Payment
          </a>
        </div>

        <p style="color: #64748b; font-size: 14px;">
          If you continue to experience issues, please contact our support team.
        </p>
      </div>

      <div style="background: #1c1917; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: #a8a29e; margin: 0; font-size: 14px;">
          Need help? Contact us at support@herbogene.com
        </p>
        <p style="color: #78716c; margin: 10px 0 0 0; font-size: 12px;">
          © ${new Date().getFullYear()} HerboGene LifeSciences. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await resend.emails.send({
      from: `HerboGene Orders <${FROM_EMAIL}>`,
      to: order.customer_email,
      subject: `Payment Failed - Order #${order.order_number}`,
      html
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending payment failed email:', error);
    return { success: false, error: error.message };
  }
}
