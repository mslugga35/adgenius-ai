import React from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'limit' | 'export' | 'template' | 'general';
  onSelectPlan: (plan: string) => void;
  userStats?: {
    mockupsToday: number;
    maxFree: number;
  };
}

/**
 * $4.99 Optimized Paywall Modal
 * Using "volume play" strategy - make it SO cheap they can't say no
 */

export const PaywallModal: React.FC<PaywallModalProps> = ({ 
  isOpen, 
  onClose, 
  trigger,
  onSelectPlan,
  userStats 
}) => {
  if (!isOpen) return null;

  const getHeadlineByTrigger = () => {
    switch (trigger) {
      case 'limit':
        return {
          title: '🎨 3 Amazing Mockups Created!',
          subtitle: 'For less than a coffee ☕, get 20 mockups daily',
          emphasis: 'Just $4.99/month - that\'s only 16¢ per day!'
        };
      case 'export':
        return {
          title: '✨ Your Design Deserves HD!',
          subtitle: 'See the professional difference with 1080p exports',
          emphasis: 'Unlock HD + Remove Watermark for just $4.99'
        };
      case 'template':
        return {
          title: '🚀 Premium Templates Await',
          subtitle: 'This template converts 73% better than basic ones',
          emphasis: 'Get 50+ templates for the price of a snack'
        };
      default:
        return {
          title: '⚡ Create Unlimited Ads',
          subtitle: 'Professional mockups in seconds with AI',
          emphasis: 'Starting at just $4.99 - cheaper than lunch!'
        };
    }
  };

  const { title, subtitle, emphasis } = getHeadlineByTrigger();

  // $4.99 optimized pricing with psychological anchoring
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 4.99,
      period: 'month',
      yearlyPrice: 49.99,
      features: [
        '20 mockups per day',
        '1080p HD exports',
        'No watermark',
        '15 templates',
        'Basic analytics',
        'Email support'
      ],
      popular: false,
      comparison: 'Perfect to start'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 14.99,
      period: 'month',
      yearlyPrice: 89.99,
      displayPrice: '$7.49/mo',
      yearlyBadge: 'SAVE 50%',
      features: [
        '🔥 UNLIMITED mockups',
        '4K Ultra HD exports',
        '50+ premium templates',
        'A/B testing tools',
        'Batch processing (10x)',
        'Background removal AI',
        'Priority support',
        'No branding'
      ],
      popular: true,
      comparison: '3x price, 10x value'
    },
    {
      id: 'business',
      name: 'Business',
      price: 39.99,
      period: 'month',
      yearlyPrice: 399.99,
      features: [
        'Everything in Pro',
        '👥 3 team members',
        'White-label option',
        'API access (1000/mo)',
        'Custom AI training',
        'Dedicated support',
        'Invoice billing'
      ],
      popular: false,
      comparison: 'For growing teams'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with $4.99 emphasis */}
        <div className="bg-gradient-to-r from-green-500 via-cyan-500 to-purple-600 p-8 text-center text-white relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-black opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg md:text-xl opacity-95 mb-3">{subtitle}</p>
            <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-black text-lg animate-pulse">
              {emphasis}
            </div>
            
            {/* Social proof for $4.99 */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                ⭐ 50,000+ users
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                💰 10x average ROI
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                ⏱️ 30 sec mockups
              </span>
            </div>
          </div>
        </div>

        {/* Value Comparison Bar */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-gray-400">Starbucks Coffee</div>
              <div className="text-xl font-bold text-red-400 line-through">$5.75</div>
            </div>
            <div className="text-3xl">vs</div>
            <div className="text-center">
              <div className="text-gray-400">AdGenius Starter</div>
              <div className="text-xl font-bold text-green-400">$4.99</div>
            </div>
            <div className="text-center bg-green-900/50 px-4 py-2 rounded-lg">
              <div className="text-green-400 font-bold">You Save</div>
              <div className="text-white">$0.76/month</div>
            </div>
          </div>
        </div>

        {/* Pricing Cards with $4.99 psychology */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gray-800 rounded-xl p-6 border-2 transition-all hover:scale-105 ${
                  plan.popular 
                    ? 'border-cyan-500 transform scale-105 shadow-2xl shadow-cyan-500/20' 
                    : 'border-gray-700'
                }`}
              >
                {plan.popular && (
                  <>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-4 py-1 rounded-full text-sm font-black">
                        BEST VALUE
                      </span>
                    </div>
                    {plan.yearlyBadge && (
                      <div className="absolute -top-4 right-4">
                        <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-black">
                          {plan.yearlyBadge}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  
                  {/* Price display optimized for $4.99 */}
                  {plan.id === 'starter' ? (
                    <div>
                      <div className="text-5xl font-black text-green-400">
                        $4<span className="text-3xl">.99</span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        Just 16¢ per day
                      </div>
                    </div>
                  ) : plan.displayPrice ? (
                    <div>
                      <div className="text-4xl font-bold text-cyan-400">
                        {plan.displayPrice}
                      </div>
                      <div className="text-gray-400 text-sm">
                        <span className="line-through">${plan.price}/mo</span> billed yearly
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-purple-400">
                      ${plan.price}
                      <span className="text-lg text-gray-400">/mo</span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-2">
                    {plan.comparison}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-300 text-sm">
                      <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={feature.startsWith('🔥') || feature.startsWith('👥') ? 'font-bold' : ''}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                    plan.id === 'starter' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30'
                      : plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.id === 'starter' ? 'Start for $4.99' : 
                   plan.id === 'business' ? 'Contact Sales' : 
                   'Get Pro Access'}
                </button>

                {/* Yearly savings callout */}
                {plan.yearlyPrice && (
                  <div className="mt-3 text-center text-xs text-gray-500">
                    or ${plan.yearlyPrice}/year (save ${((plan.price * 12) - plan.yearlyPrice).toFixed(0)})
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Trust elements for $4.99 */}
          <div className="mt-8 grid md:grid-cols-3 gap-4 text-center text-sm text-gray-400">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-bold text-white">Cancel Anytime</div>
              <div className="text-xs">No questions asked</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-bold text-white">30-Day Guarantee</div>
              <div className="text-xs">Full refund if not satisfied</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-bold text-white">Secure Payment</div>
              <div className="text-xs">256-bit SSL encryption</div>
            </div>
          </div>

          {/* ROI Calculator for $4.99 */}
          <div className="mt-6 bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-lg p-4 text-center">
            <p className="text-green-400 font-bold mb-2">💡 Quick Math:</p>
            <p className="text-sm text-gray-300">
              One professional ad design costs $50-200. 
              With AdGenius at $4.99, you break even on your <span className="text-green-400 font-bold">first mockup</span>.
              Everything after is pure savings!
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 text-gray-500 hover:text-gray-300 underline text-sm block mx-auto"
          >
            I'll stick with 3 mockups per day
          </button>
        </div>
      </div>
    </div>
  );
};