"use client";
import { Nunito } from "next/font/google";
import "./globals.css";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
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
    <html lang="en">
      <body className={`${nunito.className}`}>{children}</body>
    </html>
  );
}
