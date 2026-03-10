import {
  VideoTestimonial,
  VideoTestimonialJsonLd,
} from "@/components/video-testimonial";
import { FEATURED_VIDEO } from "@/lib/video-data";
import { Play } from "lucide-react";

/**
 * Featured video for homepage social proof (AC-2).
 * Shows 1 highlighted video testimonial.
 */
export function FeaturedVideoSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700">
            <Play className="h-4 w-4" />
            Video reference
          </div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Co říkají naši klienti
          </h2>
        </div>

        <VideoTestimonial {...FEATURED_VIDEO} featured />
        <VideoTestimonialJsonLd video={FEATURED_VIDEO} />
      </div>
    </section>
  );
}
