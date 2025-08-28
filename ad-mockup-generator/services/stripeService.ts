import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise: Promise<Stripe | null> = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
);

// Stripe Price IDs for $4.99 pricing
const PRICE_IDS = {
  starter_monthly: import.meta.env.VITE_STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_499',
  starter_yearly: import.meta.env.VITE_STRIPE_PRICE_STARTER_YEARLY || 'price_starter_4999',
  pro_monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY || 'price_pro_1499',
  pro_yearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY || 'price_pro_8999',
  business_monthly: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_MONTHLY || 'price_business_3999',
  business_yearly: import.meta.env.VITE_STRIPE_PRICE_BUSINESS_YEARLY || 'price_business_39999'
};

export interface CheckoutSessionOptions {
  priceId: string;
  customerEmail?: string;
  trialDays?: number;
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe Checkout session for subscription
 */
export const createCheckoutSession = async (options: CheckoutSessionOptions): Promise<void> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe not initialized');

    // Call your backend to create the session
    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: options.priceId,
        customerEmail: options.customerEmail,
        trialDays: options.trialDays || 7,
        metadata: options.metadata || {},
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

/**
 * Create customer portal session for subscription management
 */
export const createPortalSession = async (customerId: string): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create-portal-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create portal session');
  }

  const { url } = await response.json();
  return url;
};

/**
 * Handle plan selection from paywall
 */
export const handlePlanSelection = async (
  plan: 'starter' | 'pro' | 'business',
  billingPeriod: 'monthly' | 'yearly' = 'monthly',
  userEmail?: string
): Promise<void> => {
  // Map plan to price ID
  const priceKey = `${plan}_${billingPeriod}` as keyof typeof PRICE_IDS;
  const priceId = PRICE_IDS[priceKey];

  if (!priceId) {
    throw new Error(`Invalid plan selection: ${plan} ${billingPeriod}`);
  }

  // Track conversion attempt
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: plan === 'starter' ? 4.99 : plan === 'pro' ? 14.99 : 39.99,
      items: [{
        item_id: priceId,
        item_name: `${plan} ${billingPeriod}`,
        price: plan === 'starter' ? 4.99 : plan === 'pro' ? 14.99 : 39.99,
        quantity: 1
      }]
    });
  }

  // Create checkout session
  await createCheckoutSession({
    priceId,
    customerEmail: userEmail,
    trialDays: 7,
    metadata: {
      plan,
      billingPeriod,
      source: 'paywall'
    }
  });
};

/**
 * Check subscription status
 */
export const checkSubscriptionStatus = async (customerId: string): Promise<{
  active: boolean;
  plan: string | null;
  trialEnd: Date | null;
  cancelAt: Date | null;
}> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/subscription-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId }),
  });

  if (!response.ok) {
    throw new Error('Failed to check subscription status');
  }

  return await response.json();
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cancel-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscriptionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }
};

/**
 * Apply coupon code
 */
export const applyCoupon = async (code: string): Promise<{
  valid: boolean;
  discount: number;
  message: string;
}> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/apply-coupon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    return {
      valid: false,
      discount: 0,
      message: 'Invalid coupon code'
    };
  }

  return await response.json();
};

// Export price IDs for use in components
export { PRICE_IDS };