
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center text-white">
          <span className="text-cyan-400">Ad Mockup</span> Generator
        </h1>
        <p className="text-center text-gray-400 mt-1">Powered by Gemini 2.5 Flash Image Preview</p>
      </div>
    </header>
  );
};
