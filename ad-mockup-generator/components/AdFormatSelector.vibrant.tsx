import React from 'react';
import type { AdFormat } from '../types';

interface AdFormatSelectorProps {
  formats: AdFormat[];
  selectedFormatId: string | null;
  onSelectFormat: (format: AdFormat) => void;
}

// Icons for each format
const formatIcons: Record<string, string> = {
  'times-square': '🗽',
  'bus-stop': '🚌',
  'music-festival': '🎶',
  'magazine': '📖',
  'stadium': '🏟️',
  'street-poster': '🏙️',
  'subway': '🚇',
  'phone-mockup': '📱',
  'laptop-screen': '💻',
  'digital-display': '📺',
  'instagram-story': '📲',
  'youtube-thumbnail': '▶️'
};

export const AdFormatSelector: React.FC<AdFormatSelectorProps> = ({
  formats,
  selectedFormatId,
  onSelectFormat,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {formats.map((format) => {
        const isSelected = selectedFormatId === format.id;
        const icon = formatIcons[format.id] || '📸';
        
        return (
          <button
            key={format.id}
            onClick={() => onSelectFormat(format)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1
              ${isSelected 
                ? 'border-teal-400 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 shadow-lg shadow-teal-500/25' 
                : 'border-gray-700 hover:border-purple-500/50 bg-gray-800/50 hover:bg-gray-800/80'
              }
              group overflow-hidden
            `}
          >
            {/* Hover glow effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isSelected ? 'bg-teal-500/10' : 'bg-purple-500/10'
            } blur-xl`} />
            
            {/* Popular badge */}
            {format.popular && (
              <div className="absolute -top-1 -right-1">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  HOT
                </div>
              </div>
            )}
            
            <div className="relative z-10">
              <div className="text-3xl mb-2 group-hover:animate-bounce">
                {icon}
              </div>
              <div className="text-sm font-semibold text-gray-200">
                {format.name}
              </div>
              {format.dimensions && (
                <div className="text-xs text-gray-400 mt-1">
                  {format.dimensions}
                </div>
              )}
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute bottom-2 right-2 text-teal-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};