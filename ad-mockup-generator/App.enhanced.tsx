import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import type { AdFormat } from './types';

/**
 * Enhanced App with Strategic Paywall Implementation
 * Implements all psychological techniques from the transcript:
 * 1. Creative Friction - Block at the moment of highest desire
 * 2. Progress Investment - Track time and effort spent
 * 3. Quality Ladder - Show what they're missing
 * 4. Smart Pricing Psychology - Anchor high, sell middle
 * 5. Urgency & FOMO - Limited time offers, live activity
 */

const AppEnhanced: React.FC = () => {
  // Original state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<AdFormat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced state for paywall strategy
  const [sessionStartTime] = useState<number>(Date.now());
  const [editCount, setEditCount] = useState<number>(0);
  const [exportQuality, setExportQuality] = useState<'720p' | '1080p' | '4K'>('720p');
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const generationTimeRef = useRef<number>(0);
  
  // User store and paywall strategy
  const userStore = useUserStore();
  const paywallStrategy = usePaywallStrategy();
  const {
    isPaywallOpen,
    currentTrigger,
    paywallMessage,
    setIsPaywallOpen,
    executePaywallStrategy
  } = paywallStrategy;

  // Live activity feed simulation
  useEffect(() => {
    const activities = [
      'Sarah just created a Facebook ad',
      'Mike upgraded to PRO 🎉',
      'Lisa exported in 4K',
      'David created 10 ads today',
      'Emma unlocked all templates',
      'Alex saved 50% on yearly plan'
    ];
    
    const showActivity = () => {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      // Create toast notification
      if (window.showNotification) {
        window.showNotification(activity, 'success');
      }
    };
    
    // Show activity every 30-60 seconds
    const interval = setInterval(showActivity, 30000 + Math.random() * 30000);
    
    // Show initial activity after 5 seconds
    setTimeout(showActivity, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Track time investment for psychological trigger
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = (Date.now() - sessionStartTime) / 1000;
      
      // Check time investment trigger every minute
      if (timeSpent % 60 === 0) {
        executePaywallStrategy('track_time', {
          timeSpent,
          editCount
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionStartTime, editCount, executePaywallStrategy]);

  // Enhanced image upload with edit tracking
  const handleImageUpload = useCallback((file: File, base64: string) => {
    setUploadedFile(file);
    setImageBase64(base64);
    setGeneratedImage(null);
    setError(null);
    setEditCount(prev => prev + 1);
    
    // Track user engagement
    if (userStore.dailyMockups === 0 && userStore.totalMockups === 0) {
      // First time user - prepare welcome offer
      setTimeout(() => {
        window.showNotification?.('🎉 Welcome! Your first mockup is ready!', 'success');
      }, 2000);
    }
  }, [userStore.dailyMockups, userStore.totalMockups]);

  // Enhanced format selection with template locking
  const handleSelectFormat = useCallback((format: AdFormat) => {
    // Check if template is locked
    const isLocked = !userStore.availableTemplates.includes(format.id);
    
    if (isLocked) {
      // Trigger template lock paywall
      executePaywallStrategy('select_template', {
        templateId: format.id
      });
      return;
    }
    
    setSelectedFormat(format);
    setGeneratedImage(null);
    setError(null);
    setEditCount(prev => prev + 1);
  }, [userStore.availableTemplates, executePaywallStrategy]);

  // Enhanced generation with strategic blocking
  const handleGenerateClick = async () => {
    if (!uploadedFile || !imageBase64 || !selectedFormat) {
      setError("Please upload an image and select an ad format.");
      return;
    }

    // Check daily limit BEFORE generation (creates frustration)
    if (executePaywallStrategy('generate_mockup', {})) {
      return; // Paywall shown, block generation
    }

    generationTimeRef.current = Date.now();
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    
    // Increment mockup count
    userStore.incrementDailyMockups();

    try {
      const base64Data = imageBase64.split(',')[1];
      const resultImage = await generateAdMockup(base64Data, uploadedFile.type, selectedFormat.prompt);
      setGeneratedImage(resultImage);
      
      // Show export options automatically after generation
      setShowExportOptions(true);
      
      // Track generation success
      const generationTime = (Date.now() - generationTimeRef.current) / 1000;
      
      // If user spent significant time, prepare quality upsell
      if (generationTime > 5) {
        window.showNotification?.('✨ Your mockup is ready! Export in HD for best quality.', 'info');
      }
      
      // Check for milestone celebrations
      if (userStore.totalMockups === 10) {
        setTimeout(() => {
          window.showNotification?.('🏆 10th mockup! You\'re on fire!', 'success');
        }, 1000);
      }
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Strategic export with quality ladder
  const handleExport = useCallback(() => {
    if (!generatedImage) return;
    
    // Check export quality restrictions
    if (executePaywallStrategy('export_mockup', { quality: exportQuality })) {
      return; // Paywall shown, block export
    }
    
    // Apply watermark for free users
    if (userStore.hasWatermark) {
      window.showNotification?.('⚠️ Watermark applied. Upgrade to remove.', 'warning');
    }
    
    // Simulate export
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ad-mockup-${exportQuality}-${Date.now()}.png`;
    link.click();
    
    // Track successful export
    window.showNotification?.('✅ Exported successfully!', 'success');
    
    // Show upgrade prompt after 3rd export
    if (userStore.totalMockups === 3 && userStore.plan === 'free') {
      setTimeout(() => {
        setIsPaywallOpen(true);
      }, 2000);
    }
  }, [generatedImage, exportQuality, userStore, executePaywallStrategy, setIsPaywallOpen]);

  // Handle plan selection from paywall
  const handleSelectPlan = useCallback((plan: string) => {
    if (plan === 'agency') {
      window.showNotification?.('📞 Our team will contact you shortly!', 'info');
    } else {
      // Start trial
      userStore.startTrial();
      window.showNotification?.('🎉 Your 7-day PRO trial has started!', 'success');
    }
    setIsPaywallOpen(false);
  }, [userStore, setIsPaywallOpen]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      
      {/* Sticky Usage Tracker */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <UsageTracker />
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Inputs */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                1. Upload Your Product Image
              </h2>
              <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={imageBase64} />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                2. Select an Ad Format
              </h2>
              <AdFormatSelector
                formats={AD_FORMATS}
                selectedFormatId={selectedFormat?.id ?? null}
                onSelectFormat={handleSelectFormat}
              />
              
              {/* Show locked templates teaser */}
              {userStore.plan === 'free' && (
                <div className="mt-4 p-4 bg-purple-900/20 border border-purple-600/50 rounded-lg">
                  <p className="text-sm text-purple-300">
                    🔒 Unlock 100+ premium templates with PRO
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">
              3. Generate Your Mockup
            </h2>
            
            <div className="flex-grow flex flex-col gap-4 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <button
                onClick={handleGenerateClick}
                disabled={!uploadedFile || !selectedFormat || isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg disabled:shadow-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚡</span>
                    AI is creating your mockup...
                  </span>
                ) : (
                  'Generate Mockup with AI ✨'
                )}
              </button>
              
              <ResultDisplay
                isLoading={isLoading}
                generatedImage={generatedImage}
                error={error}
              />
              
              {/* Export Options with Quality Ladder */}
              {generatedImage && showExportOptions && (
                <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                  <h4 className="text-sm font-bold mb-3 text-gray-300">Export Quality</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setExportQuality('720p')}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        exportQuality === '720p' 
                          ? 'border-cyan-500 bg-cyan-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className="block font-bold">720p</span>
                      <span className="text-xs text-gray-400">Basic (Free)</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setExportQuality('1080p');
                        if (!userStore.canExportHD) {
                          executePaywallStrategy('export_mockup', { quality: '1080p' });
                        }
                      }}
                      className={`p-2 rounded-lg border-2 transition-all relative ${
                        exportQuality === '1080p' 
                          ? 'border-cyan-500 bg-cyan-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className="block font-bold">1080p HD</span>
                      <span className="text-xs text-gray-400">Professional</span>
                      {!userStore.canExportHD && (
                        <span className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-1 rounded">
                          PRO
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setExportQuality('4K');
                        if (!userStore.canExport4K) {
                          executePaywallStrategy('export_mockup', { quality: '4K' });
                        }
                      }}
                      className={`p-2 rounded-lg border-2 transition-all relative ${
                        exportQuality === '4K' 
                          ? 'border-cyan-500 bg-cyan-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className="block font-bold">4K Ultra</span>
                      <span className="text-xs text-gray-400">Premium</span>
                      {!userStore.canExport4K && (
                        <span className="absolute top-1 right-1 bg-purple-500 text-white text-xs px-1 rounded">
                          PRO+
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (userStore.hasWatermark) {
                          executePaywallStrategy('export_mockup', { quality: 'no-watermark' });
                        }
                      }}
                      className={`p-2 rounded-lg border-2 transition-all relative ${
                        !userStore.hasWatermark
                          ? 'border-green-500 bg-green-900/20' 
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className="block font-bold">No Watermark</span>
                      <span className="text-xs text-gray-400">Clean export</span>
                      {userStore.hasWatermark && (
                        <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                          PRO
                        </span>
                      )}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleExport}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    Export Mockup ({exportQuality})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Strategic Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        trigger={currentTrigger || 'general'}
        onSelectPlan={handleSelectPlan}
        userStats={{
          mockupsToday: userStore.dailyMockups,
          maxFree: userStore.maxDailyMockups
        }}
      />
    </div>
  );
};

export default AppEnhanced;