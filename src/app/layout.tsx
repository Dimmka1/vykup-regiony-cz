import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vykup-praha.cz"),
  title: {
    default: "Výkup nemovitostí",
    template: "%s | Výkup nemovitostí",
  },
  description: "Rychlá nezávazná konzultace výkupu nemovitostí.",
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
