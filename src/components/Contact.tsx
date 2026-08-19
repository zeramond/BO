"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import ReservationForm from "@/components/ReservationForm";

const mapsUrl = "https://maps.app.goo.gl/fBZoQBFcasWKdwHo9";
const whatsappUrl =
  "https://api.whatsapp.com/send?phone=96891309660&text=I%20would%20like%20to%20check%20bowling%20pricing%20and%20availability";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative min-h-screen overflow-hidden px-6 py-28 text-white md:px-8 md:py-36"
    >
      <Image
        src="/images/lanes_wide4.jpg"
        alt="BO Bowling lanes"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/40" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-fuchsia-600/10 blur-[160px]" />

      <div className="relative z-10 mx-auto grid min-h-[75vh] max-w-7xl items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-fuchsia-300 sm:text-sm">
            BO Bowling · Sohar
          </p>

          <h2 className="text-6xl font-bold leading-[0.95] sm:text-7xl md:text-8xl">
            Your Lane
            <br />
            Is Waiting.
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-300">
            Bowling starts from 10.5 OMR per lane/hour. Tell us your preferred
            time and our team will respond within one hour during opening
            hours.
          </p>

          <dl className="mt-9 grid max-w-xl gap-4 sm:grid-cols-2">
            <Detail label="Opening hours" value="10:00 AM–2:00 AM" />
            <Detail label="Location" value="Al Ghushbah, behind City Center" />
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-white/30 bg-black/20 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Reservations & WhatsApp
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-white/30 bg-black/20 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Get Directions
            </a>
          </div>

          <div className="mt-7 space-y-2 text-sm text-gray-400">
            <p>
              Reservations & WhatsApp:{" "}
              <a className="text-white hover:text-fuchsia-300" href="tel:+96891309660">
                +968 9130 9660
              </a>
            </p>
            <p>
              Reception:{" "}
              <a className="text-white hover:text-fuchsia-300" href="tel:+96894009477">
                +968 9400 9477
              </a>
            </p>
          </div>

          <p className="mt-8 max-w-xl border-t border-white/10 pt-7 text-sm leading-7 text-gray-400">
            Complete your visit with billiards, PlayStation, foosball, and our
            café—all under one roof.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ReservationForm />
        </motion.div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-sm">
      <dt className="text-xs uppercase tracking-[0.25em] text-gray-500">
        {label}
      </dt>
      <dd className="mt-2 font-semibold text-white">{value}</dd>
    </div>
  );
}
