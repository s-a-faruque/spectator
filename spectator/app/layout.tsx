// app/layout.tsx (Server Component)
import { Open_Sans } from "next/font/google";
import "./globals.css";
import ClientClarity from "./ClientClarity";

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full bg-gray-100 ${openSans.className}`}>
      <body className="h-full">
        {children}
        <ClientClarity />
      </body>
    </html>
  );
}

export const metadata = {
  title: "Badminton Scoring System",
  keywords: [
    "Badminton",
    "Scoring System",
    "Live Score",
    "Badminton App",
    "Scoreboard",
    "Tournament",
    "Match Tracking",
    "Sports",
    "Real-time",
  ],
  description:
    "Track live badminton scores, manage tournaments, and keep up with real-time match updates using the Badminton Scoring System.",
  openGraph: {
    title: "Badminton Scoring System",
    description:
      "Track live badminton scores, manage tournaments, and keep up with real-time match updates using the Badminton Scoring System.",
    url: "https://wtscore.com",
    siteName: "Badminton Scoring System",
    locale: "en_US",
    type: "website",
    images: [
      {
        // url: "https://wtscore.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Badminton Scoring System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Badminton Scoring System",
    description:
      "Track live badminton scores, manage tournaments, and keep up with real-time match updates.",
    // images: ["https://wtscore.com/twitter-image.jpg"],
    site: "@wtscore",
    creator: "@wtscore",
  },
};
