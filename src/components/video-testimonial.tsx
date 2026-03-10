"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

// TODO: Replace placeholder YouTube IDs with real client testimonial videos
export interface VideoTestimonialData {
  readonly videoId: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnailUrl: string;
  readonly duration: string;
  readonly uploadDate: string;
}

interface VideoTestimonialProps extends VideoTestimonialData {
  readonly featured?: boolean;
}

/**
 * YouTube video facade pattern component.
 * Shows poster + play button. Loads iframe ONLY on click (AC-4).
 * Pushes GTM dataLayer event on play (AC-5).
 * JSON-LD is rendered server-side via VideoTestimonialJsonLd.
 */
export function VideoTestimonial({
  videoId,
  title,
  description,
  thumbnailUrl,
  featured = false,
  duration,
}: VideoTestimonialProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);

    // AC-5: GTM dataLayer event
    if (typeof window !== "undefined" && "dataLayer" in window) {
      (
        window as unknown as { dataLayer: Record<string, unknown>[] }
      ).dataLayer.push({
        event: "video_play",
        video_id: videoId,
      });
    }
  }, [videoId]);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-slate-900 shadow-lg ${
        featured ? "aspect-video" : "aspect-video"
      }`}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Přehrát video: ${title}`}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* Poster image */}
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
              <svg
                className="ml-1 h-7 w-7 text-red-600 sm:h-8 sm:w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Title + duration */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-300">{description}</p>
            <span className="mt-2 inline-block rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
              {duration}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

/**
 * Server-side JSON-LD for VideoObject schema (AC-3).
 * Render this in a server component wrapping the video section.
 */
export function VideoTestimonialJsonLd({
  video,
}: {
  readonly video: VideoTestimonialData;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    duration: video.duration,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd)
          .replace(/</g, "\\u003c")
          .replace(/>/g, "\\u003e")
          .replace(/&/g, "\\u0026"),
      }}
    />
  );
}
