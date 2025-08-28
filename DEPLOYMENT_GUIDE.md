# 🚀 DEPLOYMENT GUIDE - Go Live in 30 Minutes!

## 📋 Pre-Launch Checklist

### ✅ Step 1: Stripe Setup (10 mins)
```bash
# 1. Go to https://stripe.com
# 2. Create account (if needed)
# 3. Create products:

stripe products create \
  --name="AdGenius Starter" \
  --description="20 mockups/day, HD exports, no watermark"

stripe prices create \
  --product=prod_xxx \
  --unit-amount=499 \
  --currency=usd \
  --recurring[interval]=month \
  --nickname="starter_monthly"

stripe prices create \
  --product=prod_xxx \
  --unit-amount=4999 \
  --currency=usd \
  --recurring[interval]=year \
  --nickname="starter_yearly"

# Repeat for Pro ($14.99) and Business ($39.99)
```

### ✅ Step 2: Deploy Frontend to Vercel (5 mins)

```bash
# Install Vercel CLI
npm i -g vercel

# In your frontend directory
cd C:\Users\mpmmo\AI_MEE\ad-mockup-generator

# Deploy
vercel

# Answer prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? adgenius-ai
# - Directory? ./
# - Build command? npm run build
# - Output directory? dist
```

### ✅ Step 3: Deploy Backend to Railway/Render (5 mins)

#### Option A: Railway (Easiest)
```bash
# Install Railway CLI
npm i -g @railway/cli

# In backend directory
cd C:\Users\mpmmo\AI_MEE\backend

# Deploy
railway login
railway init
railway up

# Add environment variables in Railway dashboard
```

#### Option B: Render
1. Go to https://render.com
2. New > Web Service
3. Connect GitHub repo
4. Add environment variables
5. Deploy!

### ✅ Step 4: Configure Production URLs (2 mins)

Update your `.env` files:

**Frontend (.env.production)**
```env
VITE_API_URL=https://adgenius-backend.railway.app
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
```

**Backend (.env)**
```env
FRONTEND_URL=https://adgenius-ai.vercel.app
STRIPE_SECRET_KEY=sk_live_xxxxx
```

---

## 🎯 QUICK LAUNCH STRATEGY

### Day 1: Soft Launch
1. **Product Hunt** - Schedule for next Tuesday
2. **Twitter/X** - Post demo video
3. **Reddit** - r/SideProject, r/Entrepreneur
4. **Discord** - Share in maker communities

### Day 2-7: Growth Hacks
1. **Free Trial Extended** - "Launch week special: 14-day trial"
2. **Referral Program** - "Give $5, Get $5"
3. **Limited Time** - "50% off first 100 users"

---

## 📊 ESSENTIAL ANALYTICS SETUP

### 1. Google Analytics 4
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXX');
</script>
```

### 2. Mixpanel (Better for SaaS)
```javascript
// Add to App.tsx
import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_TOKEN', {
  track_pageview: true,
  persistence: 'localStorage'
});

// Track key events
mixpanel.track('Mockup Created');
mixpanel.track('Paywall Viewed');
mixpanel.track('Plan Selected');
```

### 3. Hotjar (User Recordings)
```html
<!-- See what users actually do -->
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_ID,hjsv:6};
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## 🏃 LAUNCH DAY CHECKLIST

### Morning (9 AM)
- [ ] Post on Product Hunt
- [ ] Tweet launch announcement
- [ ] Send to email list
- [ ] Post in Discord/Slack communities

### Midday (12 PM)
- [ ] Reply to all comments
- [ ] Share in Facebook groups
- [ ] Post on LinkedIn
- [ ] Update Instagram story

### Evening (6 PM)
- [ ] Reddit posts (peak time)
- [ ] Check analytics
- [ ] Fix any urgent bugs
- [ ] Celebrate first customers! 🎉

---

## 💰 PAYMENT TESTING

### Test Card Numbers
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

### Test Flow
1. Create mockup
2. Hit daily limit
3. See paywall
4. Enter test card
5. Verify subscription created in Stripe

---

## 🔥 MARKETING ASSETS NEEDED

### 1. Demo Video (30-60 seconds)
- Show mockup creation
- Show before/after
- Show pricing

### 2. Landing Page Copy
```
Headline: "Create Pro Ad Mockups in 30 Seconds with AI"
Subhead: "No design skills needed. Just $4.99/month."
CTA: "Start Free Trial"
```

### 3. Social Proof
- Get 10 friends to try it
- Screenshot their testimonials
- Add to landing page

---

## 🚨 MONITORING & ALERTS

### 1. Uptime Monitoring (UptimeRobot)
```
- Frontend: https://adgenius-ai.vercel.app
- Backend: https://api.adgenius.ai/health
- Check every 5 minutes
```

### 2. Error Tracking (Sentry)
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### 3. Stripe Webhooks
```bash
# Test webhooks locally
stripe listen --forward-to localhost:3001/webhook

# Monitor in production
# Stripe Dashboard > Webhooks > View attempts
```

---

## 📈 WEEK 1 GOALS

### Traffic Goals
- 1,000 visitors
- 100 signups
- 10 paying customers

### Revenue Goals
- Day 1: $0-50
- Day 7: $100-200
- Day 30: $1,000 MRR

### Conversion Targets
- Visitor → Signup: 10%
- Signup → Trial: 50%
- Trial → Paid: 20%

---

## 🎁 LAUNCH PROMOTIONS

### "Founder's Price" (First 100 users)
```javascript
// 50% off for life
const FOUNDER_COUPON = "FOUNDER50";
// $2.50/month forever!
```

### Product Hunt Launch Special
```javascript
// 14-day trial instead of 7
const PH_TRIAL_DAYS = 14;
```

### Twitter Giveaway
```
"RT & Follow for 3 months free!"
// Pick 5 winners
```

---

## 🔗 QUICK LINKS

### Deployment Platforms
- Frontend: https://vercel.com
- Backend: https://railway.app or https://render.com
- Database: https://supabase.com

### Marketing Channels
- Product Hunt: https://producthunt.com/posts/new
- Reddit: https://reddit.com/r/SideProject
- Indie Hackers: https://indiehackers.com

### Analytics
- Stripe: https://dashboard.stripe.com
- Google Analytics: https://analytics.google.com
- Mixpanel: https://mixpanel.com

---

## ⚡ EMERGENCY FIXES

### If site crashes:
```bash
# Rollback Vercel
vercel rollback

# Check logs
vercel logs
```

### If payments fail:
```bash
# Check Stripe logs
stripe logs tail

# Test webhook
stripe trigger checkout.session.completed
```

### If API is slow:
```bash
# Scale up Railway
railway up --detach

# Check metrics
railway logs
```

---

## 🎉 LAUNCH IS READY!

You now have everything to go live:
1. ✅ Production-ready code
2. ✅ Payment processing
3. ✅ Deployment instructions
4. ✅ Marketing strategy
5. ✅ Analytics setup

**Next Step: Deploy and start making money!** 💰