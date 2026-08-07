import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BO Bowling | Bowling & Entertainment in Sohar",
  description:
    "Experience bowling, PlayStation gaming, billiards, foosball and café entertainment at BO Bowling in Sohar, Oman.",
  keywords: [
    "BO Bowling",
    "Bowling Sohar",
    "Bowling Oman",
    "Entertainment Sohar",
    "Billiards Sohar",
    "PlayStation Sohar",
    "Things to do in Sohar",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
