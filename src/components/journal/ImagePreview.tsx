"use client";

import { useRef, useState } from "react";
import { uploadImageToSupabase } from "@/utils/uploadToSupabase";

export default function ImagePreview({
  src,
  onChange,
}: {
  src: string;
  onChange: (imageUrl: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 500 * 1024; // 500KB

    if (file.size > MAX_SIZE) {
      alert("❌ Image size exceeds 500KB. Please choose a smaller image.");
      e.target.value = ""; // reset the input
      return;
    }

    try {
      setUploading(true);
      // Upload to Supabase and get the public URL
      const publicUrl = await uploadImageToSupabase(file);
      onChange(publicUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset the input
    }
  };

  const triggerFileInput = () => {
    fileRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {src && (
        <img
          src={src}
          alt="Preview"
          className="w-full max-h-64 object-cover rounded-md border border-gray-700/30"
        />
      )}
      <div className="flex items-center">
        <button
          onClick={triggerFileInput}
          type="button"
          disabled={uploading}
          className="bg-gradient-to-br from-gray-700/40 to-gray-800/40 text-white px-4 py-2 rounded-md border border-gray-700/50 hover:border-gray-600/30 hover:bg-gray-800/30 transition-all duration-200 shadow-sm"
        >
          {uploading ? "Uploading..." : "Choose Image"}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}