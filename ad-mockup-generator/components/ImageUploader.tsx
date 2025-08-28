
import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File, base64: string) => void;
  imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageUpload(file, reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors duration-300 bg-gray-800"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {imagePreviewUrl ? (
        <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
      ) : (
        <div className="text-center text-gray-400">
          <UploadIcon className="w-12 h-12 mx-auto mb-2" />
          <p className="font-semibold">Click to upload or drag & drop</p>
          <p className="text-sm">PNG, JPG or WEBP</p>
        </div>
      )}
    </div>
  );
};
