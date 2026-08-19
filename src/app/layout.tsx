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
  metadataBase: new URL("https://bobowlingom.com"),
  title: "BO Bowling | Bowling & Entertainment in Sohar",
  description:
    "Bowling in Sohar from 10.5 OMR per lane/hour, plus PlayStation, billiards, foosball and café entertainment at BO Bowling.",
  keywords: [
    "BO Bowling",
    "Bowling Sohar",
    "Bowling Oman",
    "Entertainment Sohar",
    "Billiards Sohar",
    "PlayStation Sohar",
    "Things to do in Sohar",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BO Bowling | Bowling & Entertainment in Sohar",
    description:
      "Bowling from 10.5 OMR per lane/hour in Al Ghushbah, Sohar. Open 10:00 AM–2:00 AM.",
    url: "https://bobowlingom.com",
    siteName: "BO Bowling",
    images: [
      {
        url: "/images/lanes_wide4.jpg",
        width: 1200,
        height: 630,
        alt: "BO Bowling lanes in Sohar",
      },
    ],
    locale: "en_OM",
    type: "website",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BowlingAlley",
  name: "BO Bowling",
  description:
    "Bowling, PlayStation, billiards, foosball and café entertainment in Sohar, Oman.",
  url: "https://bobowlingom.com",
  image: "https://bobowlingom.com/images/lanes_wide4.jpg",
  telephone: "+96891309660",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Al Ghushbah, behind City Center",
    addressLocality: "Sohar",
    addressCountry: "OM",
  },
  openingHours: "Mo-Su 10:00-02:00",
  priceRange: "From 10.5 OMR per lane/hour",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+96891309660",
      contactType: "reservations",
    },
    {
      "@type": "ContactPoint",
      telephone: "+96894009477",
      contactType: "reception",
    },
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
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </body>
    </html>
  );
}
