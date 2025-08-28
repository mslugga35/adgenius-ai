export interface AdFormat {
  id: string;
  name: string;
  prompt: string;
  dimensions?: string;
  popular?: boolean;
}

export interface PricingPlan {
  name: string;
  price: number;
  mockupsPerDay: number;
  features: string[];
  badge?: string;
}

export type UserPlan = 'free' | 'starter' | 'pro' | 'business';

export interface UserState {
  plan: UserPlan;
  dailyMockups: number;
  maxDailyMockups: number;
  lastResetDate: string;
  subscription?: {
    status: 'active' | 'inactive' | 'canceled';
    endDate?: string;
  };
}

export type PaywallTrigger = 
  | 'daily_limit_reached' 
  | 'export_quality_locked' 
  | 'watermark_removal'
  | 'batch_processing'
  | 'custom_branding';

export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: string;
}