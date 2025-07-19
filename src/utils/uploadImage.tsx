'use client';

import React, { useRef } from 'react';
import { Image as LucideImage } from 'lucide-react';

type Props = {
  src?: string;
  onChange: (file: File) => void;
};

export default function ImagePreview({ src, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file); // pass file to parent
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <div
        className="relative bg-gray-700 border border-gray-600 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition"
        onClick={() => inputRef.current?.click()}
      >
        {src ? (
          <img
            src={src}
            alt="Selected"
            className="w-full h-60 object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-60 text-gray-400">
            <div className="flex flex-col items-center">
              <LucideImage className="w-8 h-8 mb-2" />
              <span>Click to select an image</span>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
