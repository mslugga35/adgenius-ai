import React from 'react';
import { useUserStore } from '../../store/userStore';

export const UsageTracker: React.FC = () => {
  const { 
    dailyMockups, 
    maxDailyMockups, 
    plan,
    isTrialing,
    trialEndsAt,
    checkAndResetDaily 
  } = useUserStore();

  // Check for daily reset on component mount
  React.useEffect(() => {
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  const percentage = Math.min((dailyMockups / maxDailyMockups) * 100, 100);
  const remaining = Math.max(maxDailyMockups - dailyMockups, 0);
  const isUnlimited = maxDailyMockups > 1000;
  
  // Calculate days left in trial
  const getDaysLeft = () => {
    if (!isTrialing || !trialEndsAt) return null;
    const now = new Date();
    const end = new Date(trialEndsAt);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  const daysLeft = getDaysLeft();
  
  // Determine color scheme based on usage
  const getColorScheme = () => {
    if (isUnlimited) return 'cyan';
    if (percentage >= 100) return 'red';
    if (percentage >= 66) return 'yellow';
    return 'green';
  };

  const colorScheme = getColorScheme();
  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500'
  };

  const borderColors = {
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    red: 'border-red-500',
    cyan: 'border-cyan-500'
  };

  const bgColors = {
    green: 'bg-green-900/20',
    yellow: 'bg-yellow-900/20',
    red: 'bg-red-900/20',
    cyan: 'bg-cyan-900/20'
  };

  return (
    <div className="space-y-4">
      {/* Trial Banner */}
      {isTrialing && daysLeft !== null && (
        <div className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="font-bold">PRO Trial Active</p>
                <p className="text-sm opacity-90">{daysLeft} days remaining</p>
              </div>
            </div>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Usage Card */}
      <div className={`${bgColors[colorScheme]} border ${borderColors[colorScheme]} rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {isUnlimited ? '∞' : percentage >= 100 ? '🔒' : '🎯'}
            </span>
            <span className="text-gray-300 font-medium">
              {isUnlimited ? 'Unlimited Mockups' : 'Daily Mockups'}
            </span>
          </div>
          <span className="text-gray-400 text-sm">
            {isUnlimited 
              ? `${dailyMockups} created today`
              : `${dailyMockups} / ${maxDailyMockups}`
            }
          </span>
        </div>

        {!isUnlimited && (
          <>
            {/* Progress Bar */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full ${colors[colorScheme]} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Status Message */}
            <div className="text-sm text-gray-400">
              {percentage >= 100 ? (
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-medium">Daily limit reached</span>
                  <button className="text-cyan-400 hover:text-cyan-300 underline">
                    Upgrade for unlimited
                  </button>
                </div>
              ) : remaining === 1 ? (
                <span className="text-yellow-400 font-medium">
                  ⚠️ Last free mockup for today!
                </span>
              ) : (
                <span>{remaining} mockups remaining today</span>
              )}
            </div>
          </>
        )}

        {/* Plan Badge */}
        <div className="mt-3 inline-flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
            plan === 'free' 
              ? 'bg-gray-700 text-gray-300'
              : plan === 'starter'
              ? 'bg-blue-600 text-white'
              : plan === 'pro'
              ? 'bg-purple-600 text-white'
              : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
          }`}>
            {plan} {isTrialing && '(TRIAL)'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-cyan-400">{dailyMockups}</p>
          <p className="text-xs text-gray-400">Today</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-400">
            {useUserStore.getState().totalMockups}
          </p>
          <p className="text-xs text-gray-400">All Time</p>
        </div>
      </div>

      {/* CTA for Free Users */}
      {plan === 'free' && percentage >= 66 && (
        <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-600/50 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-2">
            🚀 Running low on mockups?
          </p>
          <p className="text-xs text-gray-400 mb-3">
            Upgrade to PRO for unlimited AI-powered ad creation
          </p>
          <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 px-4 rounded-lg font-bold hover:shadow-lg transition-shadow">
            Start 7-Day Free Trial
          </button>
        </div>
      )}
    </div>
  );
};