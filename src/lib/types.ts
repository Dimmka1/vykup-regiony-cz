export interface FaqItem {
  question: string;
  answer: string;
}

export interface RegionConfig {
  key: string;
  name: string;
  locative: string;
  accusative: string;
  title: string;
  description: string;
  h1: string;
  heroCta: string;
  heroImage: string;
  phone: string;
  email: string;
  primaryCity: string;
  primaryCityLocative: string;
  supportedCities: string[];
  uspPoints: string[];
  faq: FaqItem[];
  legalDisclaimer: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  hosts: string[];
  marketInfo?: string;
  themeColor?: string;
  regionFaq?: FaqItem[];
  marketAnalysis?: string;
  localProcess?: string;
  neighborhoodGuide?: string;
  additionalFaq?: FaqItem[];
}

export interface RegionDataFile {
  defaultRegion: string;
  regions: RegionConfig[];
}
