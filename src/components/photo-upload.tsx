"use client";

import type { ReactElement } from "react";
import { useCallback, useRef, useState } from "react";

/* ── Constants ─────────────────────────────────────────────── */

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.8;
const THUMBNAIL_MAX_DIMENSION = 200;
const THUMBNAIL_QUALITY = 0.6;

/* ── Types ─────────────────────────────────────────────────── */

export interface PhotoItem {
  /** Unique client-side id */
  id: string;
  /** Data URL for preview (resized to 1200px) */
  previewUrl: string;
  /** Base64-encoded thumbnail (small, for payload fallback) */
  thumbnailBase64: string;
  /** Original file name */
  fileName: string;
}

interface PhotoUploadProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
}

/* ── Helpers ───────────────────────────────────────────────── */

function generateId(): string {
  return `photo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function resizeImage(
  file: File,
  maxDim: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/* ── Component ─────────────────────────────────────────────── */

export function PhotoUpload({
  photos,
  onPhotosChange,
}: PhotoUploadProps): ReactElement {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = MAX_FILES - photos.length;

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        setError("Vyberte prosím obrázky (JPG, PNG, WebP).");
        return;
      }

      const toProcess = imageFiles.slice(0, remainingSlots);

      if (toProcess.length < imageFiles.length) {
        setError(
          `Maximálně ${MAX_FILES} fotek. Přidáno ${toProcess.length} z ${imageFiles.length}.`,
        );
      }

      const oversized = toProcess.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
      if (oversized.length > 0) {
        setError(
          `${oversized.length} ${oversized.length === 1 ? "soubor překračuje" : "soubory překračují"} limit 5 MB a ${oversized.length === 1 ? "bude přeskočen" : "budou přeskočeny"}.`,
        );
      }

      const validFiles = toProcess.filter((f) => f.size <= MAX_FILE_SIZE_BYTES);

      if (validFiles.length === 0) return;

      setIsProcessing(true);

      try {
        const newPhotos: PhotoItem[] = await Promise.all(
          validFiles.map(async (file) => {
            const [previewDataUrl, thumbnailDataUrl] = await Promise.all([
              resizeImage(file, MAX_DIMENSION, JPEG_QUALITY),
              resizeImage(file, THUMBNAIL_MAX_DIMENSION, THUMBNAIL_QUALITY),
            ]);

            return {
              id: generateId(),
              previewUrl: previewDataUrl,
              thumbnailBase64: thumbnailDataUrl,
              fileName: file.name,
            };
          }),
        );

        onPhotosChange([...photos, ...newPhotos]);
      } catch {
        setError("Nepodařilo se zpracovat obrázky. Zkuste to znovu.");
      } finally {
        setIsProcessing(false);
      }
    },
    [photos, onPhotosChange, remainingSlots],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        void processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        void processFiles(e.target.files);
      }
      e.target.value = "";
    },
    [processFiles],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onPhotosChange(photos.filter((p) => p.id !== id));
    },
    [photos, onPhotosChange],
  );

  const handleDropZoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDropZoneKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    },
    [],
  );

  return (
    <fieldset className="grid gap-4">
      <legend className="sr-only">Nahrání fotek nemovitosti</legend>

      {remainingSlots > 0 ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Klikněte nebo přetáhněte fotky"
          className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragOver
              ? "border-[var(--theme-500)] bg-[var(--theme-50)]"
              : "border-slate-300 bg-slate-50 hover:border-[var(--theme-400)] hover:bg-[var(--theme-50)]"
          } ${isProcessing ? "pointer-events-none opacity-60" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleDropZoneClick}
          onKeyDown={handleDropZoneKeyDown}
        >
          <svg
            className="mb-2 h-10 w-10 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {isProcessing ? (
            <p className="text-sm font-medium text-slate-600">
              Zpracovávám fotky…
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-700">
                Přetáhněte fotky sem nebo klikněte
              </p>
              <p className="mt-1 text-xs text-slate-500">
                JPG, PNG, WebP · max 5 MB · až {remainingSlots}{" "}
                {remainingSlots === 1
                  ? "fotka"
                  : remainingSlots < 5
                    ? "fotky"
                    : "fotek"}
              </p>
            </>
          )}
        </div>
      ) : (
        <p className="text-center text-sm text-slate-500">
          Maximální počet fotek ({MAX_FILES}) byl dosažen.
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileInput}
        aria-label="Vybrat fotky ze zařízení"
      />

      {remainingSlots > 0 ? (
        <label
          className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${isProcessing ? "pointer-events-none opacity-60" : ""}`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Vyfotit
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileInput}
            aria-label="Vyfotit kamerou"
          />
        </label>
      ) : null}

      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.previewUrl}
                alt={photo.fileName}
                className="h-20 w-full rounded-lg object-cover sm:h-24"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => handleRemove(photo.id)}
                className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label={`Odstranit ${photo.fileName}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <p className="text-center text-xs text-slate-400">
        {photos.length} / {MAX_FILES} fotek · nepovinné
      </p>
    </fieldset>
  );
}
