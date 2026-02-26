import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Výkup nemovitostí",
  description: "Rychlá nezávazná konzultace výkupu nemovitostí.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
