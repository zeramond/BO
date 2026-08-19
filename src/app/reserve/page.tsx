import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ReservationForm from "@/components/ReservationForm";

const mapsUrl = "https://maps.app.goo.gl/fBZoQBFcasWKdwHo9";
const whatsappUrl =
  "https://api.whatsapp.com/send?phone=96891309660&text=I%20would%20like%20to%20check%20bowling%20pricing%20and%20availability";

export const metadata: Metadata = {
  title: "Check Bowling Pricing & Availability | BO Bowling Sohar",
  description:
    "Request a BO Bowling lane in Sohar from 10.5 OMR per lane/hour. Choose your preferred date and time and receive a response within one hour during opening hours.",
  alternates: {
    canonical: "/reserve",
  },
};

export default function ReservePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden px-6 pb-20 pt-8 md:px-8 md:pb-28">
        <Image
          src="/images/lanes_wide4.jpg"
          alt="BO Bowling lanes in Sohar"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/75 to-fuchsia-950/55" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="flex items-center justify-between border-b border-white/10 pb-6">
            <Link href="/" className="text-2xl font-bold tracking-wide">
              BO Bowling
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Back to experience
            </Link>
          </header>

          <div className="grid items-start gap-14 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:pt-24">
            <div className="lg:sticky lg:top-10">
              <p className="text-xs uppercase tracking-[0.45em] text-fuchsia-300 sm:text-sm">
                Bowling · Sohar
              </p>
              <h1 className="mt-6 text-5xl font-bold leading-[0.98] sm:text-6xl md:text-7xl">
                Your lane,
                <br />
                your time.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-gray-300">
                Bowling starts from 10.5 OMR per lane/hour. Tell us when you
                would like to play and we will check availability for your
                group.
              </p>

              <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <InfoCard label="Starting price" value="10.5 OMR · lane/hour" />
                <InfoCard label="Response time" value="Within one hour" />
                <InfoCard label="Opening hours" value="10:00 AM–2:00 AM" />
                <InfoCard label="Location" value="Al Ghushbah, behind City Center" />
              </dl>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 bg-black/20 px-5 py-3 text-sm font-semibold transition hover:border-white hover:bg-white hover:text-black"
                >
                  WhatsApp +968 9130 9660
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 bg-black/20 px-5 py-3 text-sm font-semibold transition hover:border-white hover:bg-white hover:text-black"
                >
                  Get directions
                </a>
              </div>

              <p className="mt-6 text-sm leading-6 text-gray-500">
                Reception: <a className="text-gray-300 hover:text-white" href="tel:+96894009477">+968 9400 9477</a>
              </p>

              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-sm leading-7 text-gray-400">
                  Make more of your visit with billiards, PlayStation,
                  foosball, and our café—all available under one roof.
                </p>
              </div>
            </div>

            <ReservationForm location="reserve_page" />
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm">
      <dt className="text-xs uppercase tracking-[0.25em] text-gray-500">
        {label}
      </dt>
      <dd className="mt-2 font-semibold text-white">{value}</dd>
    </div>
  );
}
