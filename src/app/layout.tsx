import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Matchi - Your community, from day one",
    template: "%s | Matchi",
  },
  description:
    "Find activity companions, join local events, and access insider knowledge about your new city or campus. Matchi helps newcomers integrate into their community.",
  keywords: [
    "community",
    "events",
    "activities",
    "newcomers",
    "students",
    "meetup",
    "local",
  ],
  authors: [{ name: "Matchi" }],
  openGraph: {
    title: "Matchi - Your community, from day one",
    description:
      "Find activity companions, join local events, and access insider knowledge about your new city or campus.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matchi - Your community, from day one",
    description:
      "Find activity companions, join local events, and access insider knowledge about your new city or campus.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10B981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
