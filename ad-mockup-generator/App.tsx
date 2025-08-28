
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AdFormatSelector } from './components/AdFormatSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { generateAdMockup } from './services/geminiService';
import { AD_FORMATS } from './constants';
import type { AdFormat } from './types';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<AdFormat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError("Please upload an image and select an ad format.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // The base64 string from FileReader includes the data URL prefix, which we need to remove.
      const base64Data = imageBase64.split(',')[1];
      const resultImage = await generateAdMockup(base64Data, uploadedFile.type, selectedFormat.prompt);
      setGeneratedImage(resultImage);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Inputs */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">1. Upload Your Product Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={imageBase64} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">2. Select an Ad Format</h2>
              <AdFormatSelector
                formats={AD_FORMATS}
                selectedFormatId={selectedFormat?.id ?? null}
                onSelectFormat={handleSelectFormat}
              />
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">3. Generate Your Mockup</h2>
            <div className="flex-grow flex flex-col gap-4 bg-gray-800 rounded-lg p-6 border border-gray-700">
               <button
                  onClick={handleGenerateClick}
                  disabled={!uploadedFile || !selectedFormat || isLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg disabled:shadow-none"
                >
                  {isLoading ? 'Generating...' : 'Generate Mockup'}
                </button>
              <ResultDisplay
                isLoading={isLoading}
                generatedImage={generatedImage}
                error={error}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
