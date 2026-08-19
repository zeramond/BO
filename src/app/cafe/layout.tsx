import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Café Menu | BO Bowling Sohar",
  description:
    "Explore the BO Bowling café menu in Sohar, including coffee, hot drinks, cold drinks, mojitos and energy drinks.",
  alternates: {
    canonical: "/cafe",
  },
  openGraph: {
    title: "Café Menu | BO Bowling Sohar",
    description:
      "Coffee, refreshments and more at the BO Bowling café in Sohar.",
    url: "https://bobowlingom.com/cafe",
    type: "website",
  },
};

export default function CafeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
