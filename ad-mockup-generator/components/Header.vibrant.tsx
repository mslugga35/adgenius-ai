import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-purple-600/10 to-pink-600/10" />
      <div className="relative z-10 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg blur-lg opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-teal-500 to-purple-500 text-white text-2xl font-black px-3 py-1 rounded-lg">
                AG
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AdGenius AI
              </h1>
              <p className="text-xs text-gray-400">Professional mockups in seconds</p>
            </div>
          </div>
          
          {/* CTA Button */}
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 group">
            <span className="group-hover:rotate-12 transition-transform">👑</span>
            Go Pro
          </button>
        </div>
      </div>
    </header>
  );
};