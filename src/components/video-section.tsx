"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { Play } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";

interface VideoSectionProps {
  /** YouTube video URL. When empty, shows a placeholder. */
  videoUrl?: string;
}

/**
 * Extract YouTube video ID from various URL formats.
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function VideoPlaceholder(): ReactElement {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
        <Play className="h-10 w-10 text-white/60" />
      </div>
      <p className="mt-4 text-sm font-medium text-white/70">
        Video bude brzy k dispozici
      </p>
    </div>
  );
}

function YouTubeEmbed({ videoId }: { videoId: string }): ReactElement {
  const [loaded, setLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
        aria-label="Přehrát video"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-slate-900/40 transition-colors group-hover:bg-slate-900/30"
          aria-hidden="true"
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
          <Play className="h-10 w-10 text-white" fill="white" />
        </div>
      </button>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title="Video — Jak funguje výkup nemovitostí"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        loading="lazy"
      />
    </div>
  );
}

export function VideoSection({ videoUrl }: VideoSectionProps): ReactElement {
  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Jak funguje výkup nemovitostí — Výkup Regiony CZ",
    description:
      "Podívejte se, jak probíhá rychlý a férový výkup nemovitostí. Od prvního kontaktu po peníze na účtu.",
    // TODO: Replace with actual video URL when available
    contentUrl: videoUrl ?? "https://vykoupim-nemovitost.cz",
    thumbnailUrl: videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "https://vykoupim-nemovitost.cz/images/property-exterior.jpg",
    uploadDate: "2025-01-01T00:00:00+01:00",
    // TODO: Update duration when real video is available
    duration: "PT2M30S",
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          Podívejte se, jak to funguje
        </h2>
        <p className="mt-2 text-center text-slate-600">
          Celý proces výkupu nemovitosti přehledně ve videu.
        </p>

        <div className="mt-8">
          {videoId ? <YouTubeEmbed videoId={videoId} /> : <VideoPlaceholder />}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(videoJsonLd) }}
      />
    </section>
  );
}
