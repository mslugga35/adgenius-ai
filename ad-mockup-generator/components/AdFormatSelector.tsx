
import React from 'react';
import type { AdFormat } from '../types';

interface AdFormatSelectorProps {
  formats: AdFormat[];
  selectedFormatId: string | null;
  onSelectFormat: (format: AdFormat) => void;
}

export const AdFormatSelector: React.FC<AdFormatSelectorProps> = ({ formats, selectedFormatId, onSelectFormat }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {formats.map((format) => (
        <button
          key={format.id}
          onClick={() => onSelectFormat(format)}
          className={`p-3 text-center rounded-lg border-2 transition-all duration-200 text-sm font-medium
            ${selectedFormatId === format.id
              ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg'
              : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
            }`}
        >
          {format.name}
        </button>
      ))}
    </div>
  );
};
