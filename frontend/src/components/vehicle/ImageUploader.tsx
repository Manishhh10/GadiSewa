'use client';

import { useRef, useState } from 'react';
import { uploadApi } from '@/api/location.api';
import type { NormalizedError } from '@/lib/axios';

const MAX_IMAGES = 5;

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = () => inputRef.current?.click();

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setError(`You can upload up to ${MAX_IMAGES} photos.`);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const urls = await uploadApi.images(files.slice(0, room));
      onChange([...images, ...urls]);
    } catch (err) {
      setError((err as NormalizedError).message);
    } finally {
      setUploading(false);
    }
  };

  const remove = (url: string) => onChange(images.filter((u) => u !== url));

  return (
    <div>
      <div className="flex items-center justify-between mb-stack-md">
        <h2 className="font-headline-md text-headline-md">Photos</h2>
        <span className="font-body-sm text-body-sm text-outline">{images.length}/{MAX_IMAGES}</span>
      </div>
      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm mb-stack-md">
          {error}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={onFilesSelected}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-stack-md">
        {images.map((url) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-surface-container group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Vehicle" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Remove photo"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        ))}
        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={onPick}
            disabled={uploading}
            className="w-full aspect-square bg-surface-container border-2 border-dashed border-outline rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <span className="material-symbols-outlined animate-spin text-on-surface-variant text-3xl">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-on-surface-variant text-3xl">add_a_photo</span>
                <span className="text-[10px] text-on-surface-variant font-medium mt-1">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
