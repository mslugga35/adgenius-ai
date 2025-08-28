# 🎨 AdGenius AI - Ad Mockup Generator

> Create professional ad mockups in 30 seconds with AI. No design skills needed.

## 🚀 Features

- **AI-Powered Generation**: Uses Google's Gemini 2.5 Flash (Nano Banana) for instant mockup creation
- **Smart Paywall Strategy**: Psychological pricing at $4.99/month for maximum conversion
- **Multiple Export Options**: 720p (free), 1080p HD, 4K Ultra
- **100+ Templates**: Facebook, Instagram, TikTok, LinkedIn, and more
- **Batch Processing**: Create multiple mockups at once (Pro feature)

## 💰 Pricing Strategy

Based on video transcript analysis for optimal conversion:

- **FREE**: 3 mockups/day, 720p, watermark
- **STARTER ($4.99/mo)**: 20 mockups/day, HD, no watermark
- **PRO ($14.99/mo)**: Unlimited, 4K, all templates
- **BUSINESS ($39.99/mo)**: Teams, API access, white-label

## 📁 Project Structure

```
AI_MEE/
├── ad-mockup-generator/        # React frontend app
│   ├── components/
│   │   ├── paywall/           # Paywall implementation
│   │   └── tracking/          # Usage tracking
│   ├── services/
│   │   ├── geminiService.ts   # Gemini API integration
│   │   ├── stripeService.ts   # Payment processing
│   │   └── notificationService.ts
│   ├── store/
│   │   └── userStore.ts       # Zustand state management
│   └── hooks/
│       └── usePaywallStrategy.ts
├── backend/                    # Express API
│   └── server.js              # Stripe webhooks & API
└── docs/                      # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **State Management**: Zustand
- **Payments**: Stripe
- **AI**: Google Gemini API
- **Backend**: Node.js, Express
- **Database**: Supabase (optional)
- **Hosting**: Vercel (frontend), Railway (backend)

## 🔧 Local Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Stripe CLI (for webhook testing)

### Setup

1. **Clone repository**
```bash
git clone https://github.com/yourusername/adgenius-ai.git
cd adgenius-ai
```

2. **Install dependencies**
```bash
# Frontend
cd ad-mockup-generator
npm install

# Backend
cd ../backend
npm install
```

3. **Configure environment**
```bash
# Frontend
cp .env.example .env
# Add your Gemini API key and Stripe public key

# Backend
cp .env.example .env
# Add your Stripe secret key
```

4. **Run development servers**
```bash
# Terminal 1 - Frontend (port 5173)
cd ad-mockup-generator
npm run dev

# Terminal 2 - Backend (port 3001)
cd backend
npm run dev

# Terminal 3 - Stripe webhooks (optional)
stripe listen --forward-to localhost:3001/webhook
```

5. **Access app**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001/health

## 🧪 Testing Flow

1. Create a mockup (uses 1 of 3 free daily)
2. Try HD export → See paywall
3. Create 3 mockups → Hit daily limit
4. Test payment with Stripe test card: `4242 4242 4242 4242`

## 📊 Conversion Optimization

Implements psychological triggers from transcript:
- **Creative Friction**: Block at export (highest desire)
- **Progress Hook**: Visual daily limit (3 free)
- **Quality Ladder**: 720p → 1080p → 4K
- **Price Anchoring**: $4.99 looks cheap vs $14.99

Expected conversion: **5-8%** free-to-paid

## 🚀 Deployment

### Quick Deploy

**Frontend (Vercel)**
```bash
vercel
```

**Backend (Railway)**
```bash
railway up
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📈 Analytics Events

Key events to track:
- `mockup_created`
- `paywall_viewed`
- `plan_selected`
- `export_attempted`
- `daily_limit_reached`

## 🔐 Security

- Environment variables for sensitive data
- Stripe webhook signature verification
- CORS configuration
- Rate limiting (TODO)

## 📝 Development Notes

### Current Status
- ✅ Core app functionality
- ✅ Paywall implementation
- ✅ Stripe integration
- ✅ Notification system
- ⏳ Supabase integration
- ⏳ Analytics setup
- ⏳ Production deployment

### Known Issues
- Watermark not yet implemented
- Export quality restrictions need testing
- Activity feed using mock data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Paywall strategy based on video transcript analysis
- Using Google's Gemini 2.5 Flash (Nano Banana) API
- Pricing psychology optimized for conversion

---

**Revenue Goal**: $5,000 MRR in 6 months

**Current Version**: 1.0.0

**Last Updated**: August 2025