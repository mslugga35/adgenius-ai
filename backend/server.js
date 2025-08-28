const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Webhook endpoint must be before express.json() for raw body
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment successful for:', session.customer_email);
      
      // TODO: Update user subscription in database
      // await updateUserSubscription(session.customer, session.subscription);
      
      // TODO: Send welcome email
      // await sendWelcomeEmail(session.customer_email);
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('❌ Subscription cancelled:', subscription.id);
      
      // TODO: Downgrade user to free plan
      // await downgradeUser(subscription.customer);
      break;

    case 'customer.subscription.updated':
      const updatedSub = event.data.object;
      console.log('📝 Subscription updated:', updatedSub.id);
      
      // TODO: Update user plan
      // await updateUserPlan(updatedSub.customer, updatedSub);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { 
      priceId, 
      customerEmail, 
      trialDays = 7,
      metadata = {},
      successUrl,
      cancelUrl
    } = req.body;

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl || `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    // Add trial period for new customers
    if (trialDays > 0) {
      sessionConfig.subscription_data = {
        trial_period_days: trialDays
      };
    }

    // Add discount for launch pricing
    if (process.env.LAUNCH_COUPON) {
      sessionConfig.discounts = [{
        coupon: process.env.LAUNCH_COUPON
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ 
      id: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
});

// Create Customer Portal Session
app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/account`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ 
      error: 'Failed to create portal session',
      message: error.message 
    });
  }
});

// Check Subscription Status
app.post('/api/subscription-status', async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.json({
        active: false,
        plan: null,
        trialEnd: null,
        cancelAt: null
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.json({
        active: false,
        plan: null,
        trialEnd: null,
        cancelAt: null
      });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    
    // Map price ID to plan name
    let plan = 'unknown';
    if (priceId.includes('starter')) plan = 'starter';
    else if (priceId.includes('pro')) plan = 'pro';
    else if (priceId.includes('business')) plan = 'business';

    res.json({
      active: subscription.status === 'active' || subscription.status === 'trialing',
      plan: plan,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      status: subscription.status
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ 
      error: 'Failed to check subscription',
      message: error.message 
    });
  }
});

// Cancel Subscription
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    // Cancel at period end (don't immediately terminate)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ 
      success: true,
      cancelAt: new Date(subscription.cancel_at * 1000)
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      error: 'Failed to cancel subscription',
      message: error.message 
    });
  }
});

// Apply Coupon Code
app.post('/api/apply-coupon', async (req, res) => {
  try {
    const { code } = req.body;

    // Check if coupon exists and is valid
    const coupon = await stripe.coupons.retrieve(code);

    if (!coupon.valid) {
      return res.json({
        valid: false,
        discount: 0,
        message: 'This coupon has expired'
      });
    }

    res.json({
      valid: true,
      discount: coupon.percent_off || coupon.amount_off / 100,
      message: coupon.percent_off 
        ? `${coupon.percent_off}% off!` 
        : `$${coupon.amount_off / 100} off!`
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.json({
      valid: false,
      discount: 0,
      message: 'Invalid coupon code'
    });
  }
});

// Track Usage (for analytics)
app.post('/api/track', async (req, res) => {
  const { event, properties, userId } = req.body;
  
  // Log to console in development
  console.log(`[Analytics] ${event}:`, properties);
  
  // TODO: Send to your analytics service
  // await analytics.track({ userId, event, properties });
  
  res.json({ success: true });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🚀 AdGenius Backend Server           ║
║   Running on port ${PORT}                 ║
║                                        ║
║   Endpoints:                           ║
║   POST /api/create-checkout-session   ║
║   POST /api/create-portal-session     ║
║   POST /api/subscription-status       ║
║   POST /api/cancel-subscription       ║
║   POST /api/apply-coupon              ║
║   POST /webhook (Stripe)              ║
║   GET  /health                        ║
║                                        ║
╚════════════════════════════════════════╝
  `);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  WARNING: STRIPE_SECRET_KEY not set!');
  }
  
  console.log('Environment:', process.env.NODE_ENV || 'development');
});