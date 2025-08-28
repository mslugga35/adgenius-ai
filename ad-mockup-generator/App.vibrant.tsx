import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AdFormatSelector } from './components/AdFormatSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { PaywallModal } from './components/paywall/PaywallModal';
import { UsageTracker } from './components/tracking/UsageTracker';
import { generateAdMockup } from './services/geminiService';
import { AD_FORMATS } from './constants';
import { useUserStore } from './store/userStore';
import { usePaywallStrategy } from './hooks/usePaywallStrategy';
import { showNotification } from './services/notificationService';
import type { AdFormat } from './types';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<AdFormat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const { dailyMockups, maxDailyMockups, plan, incrementDailyMockups } = useUserStore();
  const { checkPaywallTrigger, getPaywallMessage } = usePaywallStrategy();

  // Animated background gradient
  useEffect(() => {
    const updateGradient = () => {
      const time = Date.now() * 0.0005;
      const color1 = `hsl(${220 + Math.sin(time) * 30}, 80%, 15%)`;
      const color2 = `hsl(${280 + Math.cos(time) * 30}, 70%, 20%)`;
      document.body.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
    };
    
    const interval = setInterval(updateGradient, 50);
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = useCallback((file: File, base64: string) => {
    setUploadedFile(file);
    setImageBase64(base64);
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleSelectFormat = useCallback((format: AdFormat) => {
    setSelectedFormat(format);
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleGenerateClick = async () => {
    if (!uploadedFile || !imageBase64 || !selectedFormat) {
      showNotification('Please upload an image and select where your ad lives!', 'error');
      return;
    }

    // Check daily limit
    if (plan === 'free' && dailyMockups >= maxDailyMockups) {
      setShowPaywall(true);
      showNotification(getPaywallMessage('daily_limit_reached'), 'warning');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Data = imageBase64.split(',')[1];
      const resultImage = await generateAdMockup(base64Data, uploadedFile.type, selectedFormat.prompt);
      setGeneratedImage(resultImage);
      incrementDailyMockups();
      showNotification('✨ Your ad mockup is ready! Looking amazing!', 'success');
      
      // Check if we should show paywall after generation
      if (checkPaywallTrigger('export_quality_locked') && plan === 'free') {
        setTimeout(() => {
          showNotification('🔓 Upgrade to export in HD without watermark!', 'info');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      showNotification('Oops! Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (plan === 'free') {
      setShowPaywall(true);
      showNotification('🔓 Upgrade to export in HD without watermark!', 'warning');
    }
  };

  return (
    <>
      <div className="min-h-screen text-gray-100 font-sans relative overflow-hidden">
        {/* Animated background overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
        
        {/* Floating orbs animation */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>

        <div className="relative z-10">
          <Header />
          
          {/* Hero Section */}
          <div className="text-center py-12 px-4">
            <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-gradient">
              🔥 Instantly Bring Your Ads to Life
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              Upload your design. Pick your stage. Watch it shine.
            </p>
          </div>

          <main className="container mx-auto px-4 py-8">
            {/* Usage Tracker */}
            {plan === 'free' && (
              <div className="max-w-6xl mx-auto mb-8">
                <UsageTracker current={dailyMockups} max={maxDailyMockups} />
              </div>
            )}

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Inputs */}
              <div className="flex flex-col gap-8">
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">1️⃣</span>
                    <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                      Upload Your Creative
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-4">Drop in your product shot or logo</p>
                  <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={imageBase64} />
                </div>

                <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">2️⃣</span>
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Choose Where Your Ad Lives
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-4">Times Square, subway, festivals, Instagram & more</p>
                  <AdFormatSelector
                    formats={AD_FORMATS}
                    selectedFormatId={selectedFormat?.id ?? null}
                    onSelectFormat={handleSelectFormat}
                  />
                </div>
              </div>

              {/* Right Column: Results */}
              <div className="flex flex-col">
                <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 shadow-2xl h-full">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">3️⃣</span>
                    <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                      Wow Instantly
                    </span>
                  </h2>
                  <p className="text-gray-400 mb-6">Click and get a polished mockup in seconds</p>
                  
                  <button
                    onClick={handleGenerateClick}
                    disabled={!uploadedFile || !selectedFormat || isLoading}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-teal-500/25 disabled:shadow-none transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Creating Magic...
                      </>
                    ) : (
                      <>
                        <span className="group-hover:animate-bounce">✨</span>
                        Make My Ad Now
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </button>

                  <div className="mt-6">
                    <ResultDisplay
                      isLoading={isLoading}
                      generatedImage={generatedImage}
                      error={error}
                      onExport={handleExport}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Activity Feed / Social Proof */}
          <div className="fixed bottom-4 left-4 bg-gray-900/80 backdrop-blur-lg rounded-lg p-3 border border-teal-500/20 max-w-xs animate-slide-up">
            <p className="text-sm text-gray-300">
              <span className="text-teal-400 font-semibold">@sarah_designer</span> just created a Times Square mockup!
            </p>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* Custom styles */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default App;