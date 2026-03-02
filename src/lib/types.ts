export interface FaqItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  author: string;
  city: string;
  quote: string;
}

export interface RegionConfig {
  key: string;
  name: string;
  locative: string;
  title: string;
  description: string;
  h1: string;
  heroCta: string;
  phone: string;
  email: string;
  primaryCity: string;
  supportedCities: string[];
  uspPoints: string[];
  faq: FaqItem[];
  testimonials: TestimonialItem[];
  legalDisclaimer: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  hosts: string[];
  marketInfo?: string;
  regionFaq?: FaqItem[];
}

export interface RegionDataFile {
  defaultRegion: string;
  regions: RegionConfig[];
}
