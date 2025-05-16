"use client";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

export const metadata = {
  title: "Your Website Title",
  description: "Description of your website for SEO",
  openGraph: {
    title: "Your Website Title",
    description: "Description of your website for social sharing",
    url: "https://yourdomain.com",
    siteName: "Your Site Name",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Website Title",
    description: "Description for Twitter card",
    images: ["https://yourdomain.com/twitter-image.jpg"],
  },
};

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  useEffect(() => {
    Clarity.init("pk1vamr87a");
  }
  , []);
  return (
    <html lang="en" className={openSans.className}>
      <body>{children}</body>
    </html>
  );
}
