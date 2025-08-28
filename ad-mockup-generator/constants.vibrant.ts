import type { AdFormat } from './types';

export const AD_FORMATS: AdFormat[] = [
  { 
    id: 'times-square', 
    name: 'Times Square Billboard', 
    prompt: 'Place this product image on a massive Times Square billboard in New York at night with bright lights and crowds',
    dimensions: '1920x1080',
    popular: true
  },
  { 
    id: 'instagram-story', 
    name: 'Instagram Story', 
    prompt: 'Create an Instagram story mockup with this image displayed on an iPhone screen held by someone in a trendy coffee shop',
    dimensions: '1080x1920',
    popular: true
  },
  { 
    id: 'bus-stop', 
    name: 'Bus Stop Ad', 
    prompt: 'Show this as an advertisement at a modern urban bus stop with people waiting',
    dimensions: '1200x1800'
  },
  { 
    id: 'music-festival', 
    name: 'Festival Banner', 
    prompt: 'Display this on a large banner at an outdoor music festival with crowds and stage lights',
    dimensions: '2400x800',
    popular: true
  },
  { 
    id: 'magazine', 
    name: 'Magazine Spread', 
    prompt: 'Place this as a full-page advertisement in a glossy fashion magazine being read',
    dimensions: '2100x2800'
  },
  { 
    id: 'stadium', 
    name: 'Stadium Display', 
    prompt: 'Show this on the giant LED screens in a packed sports stadium during a game',
    dimensions: '1920x1080'
  },
  { 
    id: 'street-poster', 
    name: 'Street Poster', 
    prompt: 'Display this as a street poster on a brick wall in an artistic urban neighborhood',
    dimensions: '700x1000'
  },
  { 
    id: 'subway', 
    name: 'Subway Platform', 
    prompt: 'Place this advertisement in a modern subway station platform with trains and commuters',
    dimensions: '1920x600'
  },
  { 
    id: 'phone-mockup', 
    name: 'Phone Screen', 
    prompt: 'Show this on a modern smartphone screen with app interface elements around it',
    dimensions: '1170x2532'
  },
  { 
    id: 'laptop-screen', 
    name: 'Laptop Display', 
    prompt: 'Display this on a MacBook screen in a modern office workspace setting',
    dimensions: '2880x1800'
  },
  { 
    id: 'digital-display', 
    name: 'Mall Digital Display', 
    prompt: 'Show this on a large digital advertising display in a busy shopping mall',
    dimensions: '1080x1920'
  },
  { 
    id: 'youtube-thumbnail', 
    name: 'YouTube Thumbnail', 
    prompt: 'Create a YouTube video thumbnail mockup with this image and play button overlay',
    dimensions: '1280x720'
  }
];

// Pricing tiers with psychological anchoring
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    mockupsPerDay: 3,
    features: [
      '3 mockups per day',
      '720p export quality',
      'Basic formats only',
      'Watermark on exports'
    ]
  },
  starter: {
    name: 'Starter',
    price: 4.99,
    mockupsPerDay: 20,
    features: [
      '20 mockups per day',
      '1080p HD exports',
      'All ad formats',
      'No watermark',
      'Priority support'
    ],
    badge: 'MOST POPULAR'
  },
  pro: {
    name: 'Pro',
    price: 14.99,
    mockupsPerDay: -1, // Unlimited
    features: [
      'UNLIMITED mockups',
      '4K Ultra HD exports',
      'All ad formats',
      'No watermark',
      'Batch processing',
      'Custom branding',
      'Priority support',
      'Early access features'
    ]
  },
  business: {
    name: 'Business',
    price: 39.99,
    mockupsPerDay: -1, // Unlimited
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'White-label options',
      'Custom templates',
      'Dedicated support',
      'SLA guarantee'
    ]
  }
};

// Paywall trigger messages
export const PAYWALL_MESSAGES = {
  daily_limit_reached: "🎯 You've used all 3 free mockups today! Upgrade to create 20+ daily.",
  export_quality_locked: "🔒 HD & 4K exports are Pro features. Upgrade to remove watermarks!",
  watermark_removal: "💎 Remove watermarks and export in stunning quality with Pro!",
  batch_processing: "⚡ Process multiple mockups at once with our Pro plan!",
  custom_branding: "🎨 Add your own branding to mockups with Pro features!"
};

// Activity feed messages (for social proof)
export const ACTIVITY_MESSAGES = [
  { user: '@sarah_designer', action: 'just created a Times Square mockup!' },
  { user: '@mike_agency', action: 'upgraded to Pro for unlimited mockups!' },
  { user: '@startup_joe', action: 'exported 10 Instagram mockups in HD!' },
  { user: '@emma_marketing', action: 'loves the new Festival Banner format!' },
  { user: '@alex_creative', action: 'saved 2 hours with batch processing!' },
  { user: '@brand_studio', action: 'created 50+ mockups this week!' }
];