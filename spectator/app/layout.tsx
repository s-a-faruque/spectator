"use client";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const openSans = Open_Sans({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

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
    <html lang="en">
      <body className={`${openSans.className}`}>{children}</body>
    </html>
  );
}
