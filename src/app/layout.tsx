import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Script from "next/script";
import { TrackingPixels } from "@/components/tracking-pixels";

const ExitIntentPopup = dynamic(
  () =>
    import("@/components/exit-intent-popup").then((mod) => mod.ExitIntentPopup),
  { ssr: true },
);
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";
import { getDefaultRegion } from "@/lib/config";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vykoupim-nemovitost.cz"),
  title: {
    default: "Výkup nemovitostí",
    template: "%s | Výkup nemovitostí",
  },
  description: "Rychlá nezávazná konzultace výkupu nemovitostí.",
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const isStrippedLayout = headersList.get("x-layout-stripped") === "1";

  return (
    <html lang="cs" className={inter.variable}>
      <head>
        {process.env.NODE_ENV === "production" && (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid="24a1c53d-bae2-4f7b-a72d-b828d4f8126c"
            data-blockingmode="auto"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <a
          href="#hlavni-obsah"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg focus:ring-2 focus:ring-[var(--theme-500)]"
        >
          Přeskočit na obsah
        </a>
        <SiteHeader phone={getDefaultRegion().phone} />
        <WebVitalsReporter />
        <main id="hlavni-obsah" className="flex-1">
          {children}
        </main>
        {!isStrippedLayout && <SiteFooter />}
        <ExitIntentPopup />
        <TrackingPixels />
      </body>
    </html>
  );
}
