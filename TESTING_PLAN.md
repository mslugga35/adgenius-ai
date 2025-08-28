# 🧪 STEP-BY-STEP TESTING PLAN

## Phase 1: Local Testing (Do This First!)

### Step 1: Test Basic App Setup
```bash
cd C:\Users\mpmmo\AI_MEE\ad-mockup-generator

# 1. Install dependencies
npm install

# 2. Check for errors
npm list

# 3. Try to build
npm run build
```

**Expected**: Should build without errors
**If fails**: Check missing dependencies

---

### Step 2: Test Gemini API Connection
```bash
# 1. Create test script
cd C:\Users\mpmmo\AI_MEE

# 2. Run simple test
python AI_MEE_START.py test
```

**Expected**: "AI_MEE is connected to Gemini API!"
**If fails**: Check API key in .env

---

### Step 3: Run Frontend Locally
```bash
cd ad-mockup-generator

# 1. Create .env file
echo VITE_GEMINI_API_KEY=AIzaSyAxH7hSdT2ovnTimIeixIW8CLSh-pirRDY > .env

# 2. Start dev server
npm run dev
```

**Test these features:**
- [ ] Upload an image
- [ ] Select a template
- [ ] Generate mockup
- [ ] See daily limit (3/3)
- [ ] Try to export
- [ ] See paywall appear

**Issues to note:**
- Does the UI load?
- Can you upload images?
- Does generation work?
- Does the paywall show?

---

### Step 4: Test Backend Server
```bash
cd C:\Users\mpmmo\AI_MEE\backend

# 1. Install dependencies
npm install

# 2. Create .env
echo PORT=3001 > .env
echo FRONTEND_URL=http://localhost:5173 >> .env

# 3. Start server
npm run dev
```

**Check**: http://localhost:3001/health
**Expected**: `{"status":"ok"}`

---

### Step 5: Test Frontend + Backend Together

**Terminal 1:**
```bash
cd ad-mockup-generator
npm run dev
```

**Terminal 2:**
```bash
cd backend
npm run dev
```

**Test flow:**
1. Open http://localhost:5173
2. Create a mockup
3. Click upgrade button
4. Check console for API calls

---

## Phase 2: Stripe Testing (After Local Works)

### Step 1: Create Stripe Test Account
1. Go to https://dashboard.stripe.com
2. Toggle to "Test mode"
3. Get test API keys

### Step 2: Create Test Products
```bash
# In Stripe Dashboard > Products
# Create manually or use CLI:

stripe products create --name="AdGenius Starter Test"
stripe prices create --unit-amount=499 --currency=usd
```

### Step 3: Update .env Files
```env
# Frontend
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Backend
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Step 4: Test Payment Flow
1. Click "Upgrade to PRO"
2. Use test card: 4242 4242 4242 4242
3. Any future date, any CVC
4. Check Stripe dashboard for payment

---

## Phase 3: Fix Common Issues

### Issue 1: "Cannot find module"
```bash
# Missing dependency
npm install [missing-module]
```

### Issue 2: "API Key Invalid"
```bash
# Check .env file exists
ls -la | grep .env

# Verify key format
cat .env
```

### Issue 3: "CORS Error"
```javascript
// In backend/server.js, ensure:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue 4: "Build Failed"
```bash
# Clear cache and rebuild
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

---

## Phase 4: Pre-Production Checklist

### Before deploying, ensure:

- [ ] App runs locally without errors
- [ ] Can create mockups
- [ ] Paywall appears at right moments
- [ ] Daily limit (3) works
- [ ] Stripe test payment succeeds
- [ ] Backend health check works
- [ ] No console errors
- [ ] Mobile responsive

---

## Testing Commands Reference

```bash
# Frontend
cd ad-mockup-generator
npm install          # Install deps
npm run dev         # Run locally
npm run build       # Build for production
npm run preview     # Preview production build

# Backend
cd backend
npm install         # Install deps
npm run dev        # Run with nodemon
npm start          # Run production

# Git
git status         # Check changes
git add .          # Stage all
git commit -m "msg" # Commit
git push           # Push to GitHub
```

---

## 📝 Test Results Log

### Test Run 1: [Date]
- [ ] Frontend loads
- [ ] Image upload works
- [ ] Mockup generation works
- [ ] Paywall displays
- [ ] Backend health check
- [ ] Stripe connection

**Issues Found:**
1. 
2. 

**Fixes Applied:**
1. 
2. 

---

## Next Steps After Testing

Once everything works locally:

1. **Create GitHub repo**
```bash
gh repo create adgenius-ai --public
git remote add origin https://github.com/yourusername/adgenius-ai.git
git push -u origin master
```

2. **Deploy to Vercel** (frontend)
3. **Deploy to Railway** (backend)
4. **Configure production env vars**
5. **Test in production**

---

## 🚨 Emergency Rollback

If something breaks in production:

```bash
# Frontend (Vercel)
vercel rollback

# Backend (Railway)
railway down
git reset --hard HEAD~1
railway up
```

---

Remember: Test locally → Fix issues → Test again → Then deploy! 🚀