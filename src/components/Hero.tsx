import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Hero() {
  return (
    <section className="relative z-10 h-screen overflow-hidden">
      <Navbar />

      <Image
        src="/images/lanes_wide4.jpg"
        alt="BO Bowling"
        fill
        priority
        className="
          object-cover
          animate-hero
        "
/>

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-8">
          <p className="fade-up delay-1 mb-5 text-sm uppercase tracking-[0.5em] text-gray-300">
            SOHAR · OMAN
          </p>

          <h1 className="fade-up delay-2 max-w-4xl text-6xl font-bold leading-tight text-white md:text-8xl">
            Where Memories
            <br />
            Are Made.
          </h1>

          <p className="fade-up delay-3 mt-8 max-w-2xl text-lg leading-8 text-gray-200 md:text-xl">
            Premium bowling lanes, billiards, café and unforgettable
            experiences—all under one roof.
          </p>

          <div className="mt-12 flex gap-4">
            <button className="fade-up delay-4 rounded-full bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105">
              Reserve Now
            </button>

            <button className="fade-up delay-4 rounded-full border border-white px-8 py-4 text-white transition-all duration-300 hover:bg-white hover:text-black">
              Explore
            </button>
          </div>
        </div>
      </div>
        <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 fade-up delay-5">
          <div className="mouse">
            <div className="mouse-wheel"></div>
              </div>
                </div>
    </section>
  );
}