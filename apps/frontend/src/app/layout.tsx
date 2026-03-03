import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://coupon.pantum.in.th";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Pantum Coupon System - Generate & Validate Discount Coupons",
    template: "%s | Pantum Coupon System",
  },
  description:
    "Generate, validate, and manage discount coupons for Pantum products. Get exclusive deals and savings on printers and supplies after every purchase.",
  keywords: [
    "Pantum",
    "coupon",
    "discount",
    "printer",
    "toner",
    "promotion",
    "Pantum India",
    "Pantum coupon code",
    "printer discount",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "Pantum Coupon System",
    title: "Pantum Coupon System - Generate & Validate Discount Coupons",
    description:
      "Generate, validate, and manage discount coupons for Pantum products. Get exclusive deals and savings after every purchase.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pantum Coupon System - Generate & Validate Discount Coupons",
    description:
      "Generate, validate, and manage discount coupons for Pantum products. Get exclusive deals and savings after every purchase.",
  },
  alternates: {
    canonical: './',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
