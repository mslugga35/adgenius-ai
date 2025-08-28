import { useState, useCallback } from 'react';
import { useUserStore } from '../store/userStore';

/**
 * Strategic Paywall Implementation
 * Based on psychological techniques from the transcript:
 * 1. Creative Friction - Users urgently need the mockup they just created
 * 2. Progress Investment - They've already spent time creating it
 * 3. Quality Ladder - Show them what they're missing (HD, no watermark)
 * 4. Pricing Anchor - Make Pro plan look affordable compared to Agency
 * 5. Urgency/FOMO - Limited time offers, activity feed
 */

export type PaywallTrigger = 
  | 'daily_limit_reached'
  | 'export_quality_locked'
  | 'template_locked' 
  | 'watermark_removal'
  | 'batch_processing'
  | 'api_access'
  | 'first_mockup_created'
  | 'third_mockup_warning';

export interface PaywallMessage {
  headline: string;
  subheadline: string;
  urgency?: string;
  socialProof?: string;
  offer?: string;
}

export const usePaywallStrategy = () => {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<PaywallTrigger | null>(null);
  const [paywallMessage, setPaywallMessage] = useState<PaywallMessage | null>(null);
  
  const userStore = useUserStore();
  const { 
    dailyMockups, 
    maxDailyMockups, 
    plan, 
    isTrialing,
    hasWatermark,
    canExportHD,
    canExport4K
  } = userStore;

  /**
   * STRATEGIC TRIGGER #1: Daily Limit Friction
   * Psychology: User is in flow state, suddenly blocked
   * Emotion: Frustration that can be instantly relieved
   */
  const checkDailyLimit = useCallback((): boolean => {
    if (plan === 'free' && dailyMockups >= maxDailyMockups) {
      setCurrentTrigger('daily_limit_reached');
      setPaywallMessage({
        headline: "🔥 You're on Fire Today!",
        subheadline: `You've created ${dailyMockups} amazing mockups! Your designs are looking professional.`,
        urgency: "Unlock unlimited mockups right now",
        socialProof: "Join 12,847 marketers who upgraded today",
        offer: "🎁 50% OFF first month - Expires in 10 minutes"
      });
      setIsPaywallOpen(true);
      return true;
    }
    return false;
  }, [dailyMockups, maxDailyMockups, plan]);

  /**
   * STRATEGIC TRIGGER #2: Export Quality Ladder
   * Psychology: They see their perfect mockup but can't get it in HD
   * Emotion: So close yet so far - create desire gap
   */
  const checkExportQuality = useCallback((requestedQuality: '720p' | '1080p' | '4K'): boolean => {
    if (plan === 'free') {
      if (requestedQuality === '1080p' && !canExportHD) {
        setCurrentTrigger('export_quality_locked');
        setPaywallMessage({
          headline: "🎨 Your Ad Looks Perfect!",
          subheadline: "Don't let low quality ruin your professional design. HD makes all the difference.",
          urgency: "See the HD difference instantly",
          socialProof: "89% of users say HD exports increased their ad performance",
          offer: "⚡ Unlock HD + Remove Watermark NOW"
        });
        setIsPaywallOpen(true);
        return true;
      }
      
      if (requestedQuality === '4K' && !canExport4K) {
        setCurrentTrigger('export_quality_locked');
        setPaywallMessage({
          headline: "📸 Ready for Ultra HD?",
          subheadline: "4K exports for stunning clarity on retina displays and large formats.",
          urgency: "Premium quality for premium brands",
          socialProof: "Used by Fortune 500 marketing teams",
          offer: "🚀 Get 4K Access + 100 Templates"
        });
        setIsPaywallOpen(true);
        return true;
      }
    }
    return false;
  }, [plan, canExportHD, canExport4K]);

  /**
   * STRATEGIC TRIGGER #3: Watermark Friction
   * Psychology: Their brand mixed with our watermark = unusable
   * Emotion: Pride in creation blocked by embarrassment
   */
  const checkWatermarkRemoval = useCallback((): boolean => {
    if (hasWatermark) {
      setCurrentTrigger('watermark_removal');
      setPaywallMessage({
        headline: "🏆 Go Professional",
        subheadline: "Your brand deserves clean, watermark-free ads that convert.",
        urgency: "Start looking professional today",
        socialProof: "Watermark-free ads get 3x more engagement",
        offer: "✨ Remove watermark + Get HD exports"
      });
      setIsPaywallOpen(true);
      return true;
    }
    return false;
  }, [hasWatermark]);

  /**
   * STRATEGIC TRIGGER #4: Template Teasing
   * Psychology: Show locked premium templates users want
   * Emotion: FOMO - everyone else has access to these
   */
  const checkTemplateLock = useCallback((templateId: string): boolean => {
    const { availableTemplates } = userStore;
    
    if (!availableTemplates.includes(templateId)) {
      setCurrentTrigger('template_locked');
      setPaywallMessage({
        headline: "🎯 Unlock Premium Templates",
        subheadline: "This template is used by top performing ads. Don't miss out.",
        urgency: "Get instant access to 100+ templates",
        socialProof: "This template has 73% higher CTR",
        offer: "🔓 Unlock ALL templates + Unlimited mockups"
      });
      setIsPaywallOpen(true);
      return true;
    }
    return false;
  }, [userStore]);

  /**
   * STRATEGIC TRIGGER #5: Progress Warning
   * Psychology: Warn before limit to create anticipation
   * Emotion: Anxiety that motivates preemptive action
   */
  const checkProgressWarning = useCallback((): void => {
    if (plan === 'free') {
      // Warning at 2 of 3 mockups
      if (dailyMockups === 2 && maxDailyMockups === 3) {
        setCurrentTrigger('third_mockup_warning');
        // Don't open paywall, just show warning notification
        showWarningNotification("⚠️ Last free mockup remaining today!");
      }
      
      // Celebration after first mockup to build confidence
      if (dailyMockups === 1 && userStore.totalMockups === 1) {
        setCurrentTrigger('first_mockup_created');
        showCelebrationNotification("🎉 Your first mockup looks amazing!");
        // Delay paywall by 3 seconds to let them enjoy the moment
        setTimeout(() => {
          setPaywallMessage({
            headline: "🌟 Great Start!",
            subheadline: "You're a natural! Imagine what you could create with unlimited access.",
            urgency: "Special offer for new users",
            socialProof: "New users who upgrade now save 70%",
            offer: "🎁 NEW USER SPECIAL: 70% OFF"
          });
          setIsPaywallOpen(true);
        }, 3000);
      }
    }
  }, [dailyMockups, maxDailyMockups, plan, userStore.totalMockups]);

  /**
   * STRATEGIC TRIGGER #6: Smart Timing
   * Psychology: Strike when emotional investment is highest
   * Best moments: After spending 5+ minutes, after multiple edits, at export
   */
  const checkTimeInvestment = useCallback((timeSpent: number, editCount: number): void => {
    if (plan === 'free' && timeSpent > 300 && editCount > 3) {
      // User invested significant time
      setCurrentTrigger('export_quality_locked');
      setPaywallMessage({
        headline: "💎 You've Created Something Special",
        subheadline: `You spent ${Math.round(timeSpent / 60)} minutes perfecting this. Don't waste it on low quality.`,
        urgency: "Export in HD before you lose your work",
        socialProof: "Designers spend 47% less time with Pro tools",
        offer: "⏰ LIMITED: Upgrade in next 5 min for 60% off"
      });
      // Don't open immediately, wait for export attempt
    }
  }, [plan]);

  /**
   * Notification helpers for subtle psychological nudges
   */
  const showWarningNotification = (message: string) => {
    // Implementation would trigger a toast/notification
    console.log('[WARNING]', message);
  };

  const showCelebrationNotification = (message: string) => {
    // Implementation would trigger a celebration animation
    console.log('[CELEBRATION]', message);
  };

  /**
   * PRICING PSYCHOLOGY from transcript:
   * - Show expensive option first (Agency $99)
   * - Make Pro ($29) look cheap by comparison  
   * - Hide true monthly ($39) behind "Show all plans"
   * - Display monthly breakdown of yearly ($9/mo) in large text
   */
  const getPricingStrategy = () => ({
    displayOrder: ['pro', 'agency', 'starter'], // Pro first with "MOST POPULAR"
    proPricing: {
      display: '$9', // Show monthly breakdown
      actual: '$108/year', // Small text
      savings: 'SAVE 70%', // Big badge
      comparison: 'vs $39/month' // Create anchor
    },
    urgencyFactors: {
      countdown: true, // "Offer ends in 10:00"
      limitedSlots: true, // "Only 3 spots left at this price"
      socialProof: true, // "147 people upgraded in last hour"
      recentActivity: true // Live feed of upgrades
    }
  });

  /**
   * Master orchestrator - Combines all psychological triggers
   */
  const executePaywallStrategy = useCallback((action: string, metadata?: any): boolean => {
    // Check triggers in order of effectiveness (from transcript analysis)
    
    // 1. Daily limit is most effective (complete block)
    if (action === 'generate_mockup') {
      if (checkDailyLimit()) return true;
      checkProgressWarning();
    }
    
    // 2. Export quality creates strongest desire (so close!)
    if (action === 'export_mockup') {
      const quality = metadata?.quality || '720p';
      if (checkExportQuality(quality)) return true;
      if (checkWatermarkRemoval()) return true;
    }
    
    // 3. Template lock creates FOMO
    if (action === 'select_template') {
      const templateId = metadata?.templateId;
      if (checkTemplateLock(templateId)) return true;
    }
    
    // 4. Time investment (only track, don't block)
    if (action === 'track_time') {
      checkTimeInvestment(metadata?.timeSpent, metadata?.editCount);
    }
    
    return false;
  }, [checkDailyLimit, checkExportQuality, checkWatermarkRemoval, checkTemplateLock, checkTimeInvestment, checkProgressWarning]);

  return {
    isPaywallOpen,
    currentTrigger,
    paywallMessage,
    setIsPaywallOpen,
    executePaywallStrategy,
    getPricingStrategy,
    
    // Direct trigger methods for testing
    triggers: {
      checkDailyLimit,
      checkExportQuality,
      checkWatermarkRemoval,
      checkTemplateLock,
      checkProgressWarning,
      checkTimeInvestment
    }
  };
};