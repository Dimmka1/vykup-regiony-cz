import type { VideoTestimonialData } from "@/components/video-testimonial";

/**
 * TODO: Replace all placeholder YouTube IDs with real client testimonial videos.
 * Current videos are generic real estate content for development/demo purposes.
 */
export const VIDEO_TESTIMONIALS: readonly VideoTestimonialData[] = [
  {
    // TODO: Replace with real testimonial video
    videoId: "dCmABHEEBIc",
    title: "Prodej bytu v Praze — zkušenost klienta",
    description:
      "Jak jsme pomohli s rychlým prodejem bytu v Praze za férovou cenu.",
    thumbnailUrl: "https://img.youtube.com/vi/dCmABHEEBIc/maxresdefault.jpg",
    duration: "PT3M25S",
    uploadDate: "2025-01-15",
  },
  {
    // TODO: Replace with real testimonial video
    videoId: "6stlCkUDG_s",
    title: "Výkup nemovitosti s hypotékou",
    description:
      "Klient popisuje, jak zvládl prodat nemovitost zatíženou hypotékou.",
    thumbnailUrl: "https://img.youtube.com/vi/6stlCkUDG_s/maxresdefault.jpg",
    duration: "PT4M10S",
    uploadDate: "2025-02-20",
  },
  {
    // TODO: Replace with real testimonial video
    videoId: "NMo3nZHVrZ4",
    title: "Rychlý prodej rodinného domu",
    description:
      "Celý proces výkupu domu trval pouhých 10 dní od prvního kontaktu.",
    thumbnailUrl: "https://img.youtube.com/vi/NMo3nZHVrZ4/maxresdefault.jpg",
    duration: "PT2M48S",
    uploadDate: "2025-03-01",
  },
  {
    // TODO: Replace with real testimonial video
    videoId: "cdMSwdb1HBo",
    title: "Prodej nemovitosti v exekuci",
    description:
      "Pomohli jsme klientovi vyřešit složitou situaci s exekucí na nemovitosti.",
    thumbnailUrl: "https://img.youtube.com/vi/cdMSwdb1HBo/maxresdefault.jpg",
    duration: "PT5M12S",
    uploadDate: "2025-01-28",
  },
] as const;

/** Featured video for homepage — first item from testimonials */
export const FEATURED_VIDEO: VideoTestimonialData = VIDEO_TESTIMONIALS[0];
