import React, { useState } from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
  onExport?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  isLoading,
  generatedImage,
  error,
  onExport
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (quality: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      if (onExport) onExport();
    }, 1000);
  };

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-400 font-semibold">Oops! Something went wrong</p>
            <p className="text-gray-300 text-sm mt-1">{error}</p>
            <button className="mt-3 text-teal-400 hover:text-teal-300 text-sm underline">
              Try again with a different image
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 text-teal-500 animate-spin">
            <SpinnerIcon />
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-teal-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        <p className="mt-6 text-gray-300 font-semibold animate-pulse">
          Creating your masterpiece...
        </p>
        <div className="mt-2 flex gap-1">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Generated Image with glow effect */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
          <div className="relative bg-gray-900 rounded-xl p-2">
            <img
              src={generatedImage}
              alt="Generated mockup"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            {/* Success badge */}
            <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-2 animate-slide-down">
              <span>✨</span>
              <span className="font-semibold">Ready!</span>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-200 mb-3 flex items-center gap-2">
            <span>💾</span> Export Your Mockup
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Free/720p Option */}
            <button
              onClick={() => handleExport('720p')}
              disabled={isExporting}
              className="relative group bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-sm font-semibold text-gray-200">720p</div>
              <div className="text-xs text-gray-400 mt-1">Free</div>
              <div className="text-xs text-yellow-400 mt-1">⚠️ Watermark</div>
            </button>

            {/* HD Option */}
            <button
              onClick={() => handleExport('1080p')}
              disabled={isExporting}
              className="relative group bg-gradient-to-br from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-lg p-3 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
            >
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                PRO
              </div>
              <div className="text-sm font-semibold text-white">1080p HD</div>
              <div className="text-xs text-teal-100 mt-1">No watermark</div>
              <div className="text-xs text-teal-200 mt-1">🔒 $4.99/mo</div>
            </button>

            {/* 4K Option */}
            <button
              onClick={() => handleExport('4k')}
              disabled={isExporting}
              className="relative group bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg p-3 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
            >
              <div className="text-sm font-semibold text-white">4K Ultra</div>
              <div className="text-xs text-purple-100 mt-1">Premium</div>
              <div className="text-xs text-purple-200 mt-1">🔒 $14.99/mo</div>
            </button>
          </div>

          {isExporting && (
            <div className="mt-3 text-center text-sm text-gray-400 animate-pulse">
              Preparing export...
            </div>
          )}
        </div>

        {/* Share Options */}
        <div className="flex justify-center gap-3">
          <button className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-red-400 transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 opacity-20">🎨</div>
        <p className="text-gray-400 text-lg">Your mockup will appear here</p>
        <p className="text-gray-500 text-sm mt-2">Upload an image and select a format to begin</p>
      </div>
    </div>
  );
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slide-down {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  .animate-slide-down {
    animation: slide-down 0.5s ease-out;
  }
`;
document.head.appendChild(style);