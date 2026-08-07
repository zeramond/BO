import Image from "next/image";

const reservationUrl =
  "https://api.whatsapp.com/send?phone=96891309660&text=I%20would%20like%20to%20ask%20about%20reservations";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative z-10 min-h-[100svh] overflow-hidden"
    >
      <Image
        src="/images/lanes_wide4.jpg"
        alt="BO Bowling"
        fill
        priority
        sizes="100vw"
        className="animate-hero object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Slightly stronger mobile gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent md:from-transparent" />

      <div className="relative z-10 flex min-h-[100svh] items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pt-16 md:px-8 md:pt-0">
          <p className="fade-up delay-1 mb-4 text-xs uppercase tracking-[0.4em] text-gray-300 sm:text-sm md:mb-5 md:tracking-[0.5em]">
            SOHAR · OMAN
          </p>

          <h1 className="fade-up delay-2 max-w-4xl text-5xl font-bold leading-[0.98] text-white sm:text-6xl md:text-8xl md:leading-tight">
            Where Memories
            <br />
            Are Made.
          </h1>

          <p className="fade-up delay-3 mt-6 max-w-xl text-base leading-7 text-gray-200 sm:text-lg md:mt-8 md:max-w-2xl md:text-xl md:leading-8">
            Premium bowling lanes, billiards, café and unforgettable
            experiences—all under one roof.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-12">
            <a
              href={reservationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="fade-up delay-4 inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 sm:w-auto"
            >
              Reserve Now
            </a>

            <a
              href="#experience"
              className="fade-up delay-4 inline-flex w-full items-center justify-center rounded-full border border-white px-8 py-4 text-white transition-all duration-300 hover:bg-white hover:text-black sm:w-auto"
            >
              Explore
            </a>
          </div>
        </div>
      </div>

      <div className="fade-up delay-5 absolute bottom-6 left-1/2 z-20 -translate-x-1/2 md:bottom-10">
        <div className="mouse">
          <div className="mouse-wheel" />
        </div>
      </div>
    </section>
  );
}