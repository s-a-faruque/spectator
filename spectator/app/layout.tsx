"use client";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

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
