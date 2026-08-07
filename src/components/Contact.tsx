"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-32 text-white md:px-8"
    >
      {/* BACKGROUND IMAGE */}
      <Image
        src="/images/lanes_wide.jpg"
        alt="BO Bowling lanes"
        fill
        sizes="100vw"
        className="object-cover"
      />

      {/* DARK CINEMATIC OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* SUBTLE GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />

      {/* MAGENTA AMBIENT GLOW */}
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[150px]" />

      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.35,
        }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <p className="mb-6 text-sm uppercase tracking-[0.5em] text-fuchsia-300">
          BO BOWLING · SOHAR
        </p>

        <h2 className="max-w-5xl text-6xl font-bold leading-[0.95] md:text-8xl lg:text-9xl">
          Your Lane
          <br />
          Is Waiting.
        </h2>

        <p className="mt-10 max-w-2xl text-lg leading-8 text-gray-300 md:text-xl">
          Bring your friends, bring your family, and make your next night out
          one to remember.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
  href="https://api.whatsapp.com/send?phone=96891309660&text=I%20would%20like%20to%20ask%20about%20reservations"
  target="_blank"
  rel="noopener noreferrer"
  className="rounded-full bg-white px-8 py-4 font-semibold text-black transition duration-300 hover:scale-105"
>
  Make a Reservation
</a>

          <button className="rounded-full border border-white/40 bg-black/20 px-8 py-4 font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-black">
            Get Directions
          </button>
        </div>

        <div className="mt-24 border-t border-white/15 pt-8">
          <p className="text-sm tracking-[0.3em] text-gray-400">
            BOWLING · GAMING · BILLIARDS · CAFÉ
          </p>
        </div>
      </motion.div>
    </section>
  );
}