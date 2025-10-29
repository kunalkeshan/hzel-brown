import type { Metadata } from "next";
import { Libre_Baskerville, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/config/site";

const sans = Libre_Baskerville({
  variable: "--font-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const serif = Lora({
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.URL),
  formatDetection: {
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
