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
          title: '🔥 You\'re on Fire!',
          subtitle: `You've created ${userStats?.mockupsToday || 3} amazing mockups today! Go unlimited with PRO.`
        };
      case 'export':
        return {
          title: '🎨 Your Ad Looks Perfect!',
          subtitle: 'Unlock HD export and remove watermark to make it shine professionally.'
        };
      case 'template':
        return {
          title: '🚀 Unlock Premium Templates',
          subtitle: 'Get instant access to 100+ professional templates for every platform.'
        };
      default:
        return {
          title: '⚡ Supercharge Your Ads',
          subtitle: 'Create unlimited professional mockups with AI-powered design.'
        };
    }
  };

  const { title, subtitle } = getHeadlineByTrigger();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 9.99,
      period: 'month',
      features: [
        '30 mockups per day',
        '1080p HD exports',
        '20 premium templates',
        'No watermark',
        'Basic analytics',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 29.99,
      period: 'month',
      features: [
        'Unlimited mockups',
        '4K Ultra HD exports',
        '100+ templates',
        'Custom branding',
        'A/B testing',
        'Batch processing',
        'API access',
        'Priority support'
      ],
      popular: true,
      savings: 'SAVE 50%'
    },
    {
      id: 'agency',
      name: 'Agency',
      price: 99.99,
      period: 'month',
      features: [
        'Everything in Pro',
        'White-label option',
        'Unlimited team members',
        'Custom AI training',
        'Advanced analytics',
        'Dedicated support',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg md:text-xl opacity-95">{subtitle}</p>
          <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold mt-6 animate-pulse">
            LIMITED TIME: 50% OFF FIRST MONTH
          </div>
        </div>

        {/* Pricing Cards */}
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
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {plan.savings && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {plan.savings}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-cyan-400">
                    ${plan.price}
                    <span className="text-lg text-gray-400">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.id === 'agency' ? 'Contact Sales' : 'Start 7-Day Free Trial'}
                </button>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p className="mb-2">
              ✅ Cancel anytime • 🔒 Secure payment • 💰 30-day money back guarantee
            </p>
            <p>Join 10,000+ marketers creating stunning ads with AdGenius AI</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 text-gray-500 hover:text-gray-300 underline text-sm block mx-auto"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};