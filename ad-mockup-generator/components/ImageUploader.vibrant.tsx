import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File, base64: string) => void;
  imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  imagePreviewUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 100);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setTimeout(() => {
        onImageUpload(file, base64);
        setUploadProgress(0);
      }, 600);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div
      className={`
        relative rounded-xl border-2 border-dashed transition-all duration-300
        ${isDragging 
          ? 'border-teal-400 bg-teal-500/10 scale-105' 
          : 'border-gray-600 hover:border-purple-500 bg-gray-800/30 hover:bg-gray-800/50'
        }
        ${imagePreviewUrl ? 'p-2' : 'p-8'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Upload progress bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-700 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {imagePreviewUrl ? (
        <div className="relative group">
          <img
            src={imagePreviewUrl}
            alt="Uploaded preview"
            className="w-full h-48 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 transform hover:scale-105"
            >
              Change Image
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Ready
          </div>
        </div>
      ) : (
        <div
          className="text-center cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 text-gray-500 group-hover:text-teal-400 transition-colors duration-300 group-hover:animate-bounce">
              <UploadIcon />
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-200 mb-2">
            {isDragging ? 'Drop it here!' : 'Drag & Drop Your Creative'}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            or{' '}
            <span className="text-teal-400 hover:text-teal-300 underline">
              browse files
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Supports: PNG, JPG, WEBP (Max 10MB)
          </p>
          
          {/* Animated dots */}
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
};