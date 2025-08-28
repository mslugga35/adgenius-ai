
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, error }) => {
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'ad-mockup.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="w-full flex-grow bg-gray-900/50 rounded-lg flex items-center justify-center p-4 min-h-[300px]">
      {isLoading && (
        <div className="text-center text-gray-400">
          <SpinnerIcon className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="font-semibold text-lg">Generating your masterpiece...</p>
          <p className="text-sm">This may take a moment.</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
          <h3 className="font-bold text-lg">An Error Occurred</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {generatedImage && !isLoading && (
        <div className="w-full flex flex-col gap-4 items-center">
            <img src={generatedImage} alt="Generated ad mockup" className="max-w-full max-h-[400px] object-contain rounded-md shadow-lg" />
            <button
                onClick={handleDownload}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 mt-2"
            >
                Download Image
            </button>
        </div>
      )}
      {!isLoading && !error && !generatedImage && (
        <div className="text-center text-gray-500">
          <p>Your generated ad mockup will appear here.</p>
        </div>
      )}
    </div>
  );
};
