import {
  VideoTestimonial,
  VideoTestimonialJsonLd,
} from "@/components/video-testimonial";
import { VIDEO_TESTIMONIALS } from "@/lib/video-data";
import { Play } from "lucide-react";

/**
 * Video testimonials grid for /reference page (AC-1).
 * Renders 3+ videos with facade pattern + JSON-LD per video (AC-3).
 */
export function VideoTestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700">
          <Play className="h-4 w-4" />
          Video reference
        </div>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Podívejte se na zkušenosti našich klientů
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Naši klienti sdílejí své zkušenosti s rychlým výkupem nemovitostí.
          Přesvědčte se sami.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {VIDEO_TESTIMONIALS.map((video) => (
          <div key={video.videoId}>
            <VideoTestimonial {...video} />
            <VideoTestimonialJsonLd video={video} />
          </div>
        ))}
      </div>
    </section>
  );
}
