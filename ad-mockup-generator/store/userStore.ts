import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserState {
  // User Plan
  plan: 'free' | 'starter' | 'pro' | 'agency';
  isTrialing: boolean;
  trialEndsAt: Date | null;
  
  // Usage Tracking
  dailyMockups: number;
  totalMockups: number;
  lastResetDate: string;
  
  // Features
  maxDailyMockups: number;
  canExportHD: boolean;
  canExport4K: boolean;
  hasWatermark: boolean;
  availableTemplates: string[];
  
  // Actions
  incrementDailyMockups: () => void;
  resetDailyLimits: () => void;
  upgradePlan: (plan: 'starter' | 'pro' | 'agency') => void;
  startTrial: () => void;
  checkAndResetDaily: () => void;
}

const FREE_TEMPLATES = ['facebook', 'instagram-post', 'instagram-story'];
const STARTER_TEMPLATES = [...FREE_TEMPLATES, 'twitter', 'linkedin', 'youtube-thumbnail'];
const PRO_TEMPLATES = [...STARTER_TEMPLATES, 'tiktok', 'pinterest', 'google-display', 'banner-728x90', 'banner-300x250'];

const PLAN_LIMITS = {
  free: {
    maxDailyMockups: 3,
    canExportHD: false,
    canExport4K: false,
    hasWatermark: true,
    availableTemplates: FREE_TEMPLATES
  },
  starter: {
    maxDailyMockups: 30,
    canExportHD: true,
    canExport4K: false,
    hasWatermark: false,
    availableTemplates: STARTER_TEMPLATES
  },
  pro: {
    maxDailyMockups: 999999, // Unlimited
    canExportHD: true,
    canExport4K: true,
    hasWatermark: false,
    availableTemplates: PRO_TEMPLATES
  },
  agency: {
    maxDailyMockups: 999999, // Unlimited
    canExportHD: true,
    canExport4K: true,
    hasWatermark: false,
    availableTemplates: PRO_TEMPLATES
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      plan: 'free',
      isTrialing: false,
      trialEndsAt: null,
      dailyMockups: 0,
      totalMockups: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      maxDailyMockups: PLAN_LIMITS.free.maxDailyMockups,
      canExportHD: PLAN_LIMITS.free.canExportHD,
      canExport4K: PLAN_LIMITS.free.canExport4K,
      hasWatermark: PLAN_LIMITS.free.hasWatermark,
      availableTemplates: PLAN_LIMITS.free.availableTemplates,

      // Increment daily mockups
      incrementDailyMockups: () => set((state) => {
        // Check if we need to reset daily limits first
        get().checkAndResetDaily();
        
        return {
          dailyMockups: state.dailyMockups + 1,
          totalMockups: state.totalMockups + 1
        };
      }),

      // Reset daily limits
      resetDailyLimits: () => set(() => ({
        dailyMockups: 0,
        lastResetDate: new Date().toISOString().split('T')[0]
      })),

      // Check and reset daily limits if needed
      checkAndResetDaily: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        
        if (state.lastResetDate !== today) {
          set({
            dailyMockups: 0,
            lastResetDate: today
          });
        }
      },

      // Upgrade plan
      upgradePlan: (newPlan) => set(() => {
        const limits = PLAN_LIMITS[newPlan];
        return {
          plan: newPlan,
          ...limits
        };
      }),

      // Start trial
      startTrial: () => set(() => {
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);
        
        return {
          isTrialing: true,
          trialEndsAt: trialEnd,
          plan: 'pro',
          ...PLAN_LIMITS.pro
        };
      })
    }),
    {
      name: 'adgenius-user-storage',
      partialize: (state) => ({
        plan: state.plan,
        isTrialing: state.isTrialing,
        trialEndsAt: state.trialEndsAt,
        dailyMockups: state.dailyMockups,
        totalMockups: state.totalMockups,
        lastResetDate: state.lastResetDate
      })
    }
  )
);