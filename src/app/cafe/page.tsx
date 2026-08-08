"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const menuImages = [
  {
    src: "/images/cafe-menu/menu-energy.jpeg",
    alt: "BO Bowling Café energy drinks menu",
  },
  {
    src: "/images/cafe-menu/menu-cold-drinks.jpeg",
    alt: "BO Bowling Café cold drinks menu",
  },
  {
    src: "/images/cafe-menu/menu-mojito.jpeg",
    alt: "BO Bowling Café mojito menu",
  },
  {
    src: "/images/cafe-menu/menu-hot-drinks.jpeg",
    alt: "BO Bowling Café hot drinks menu",
  },
  {
    src: "/images/cafe-menu/menu-hot-drinks-2.jpeg",
    alt: "BO Bowling Café coffee menu",
  },
  {
    src: "/images/cafe-menu/menu-cold-drinks-2.jpeg",
    alt: "BO Bowling Café refreshments menu",
  },
];

export default function CafePage() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = useCallback((index: number) => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const nextIndex =
      (index + menuImages.length) % menuImages.length;

    carousel.scrollTo({
      left: carousel.clientWidth * nextIndex,
      behavior: "smooth",
    });

    setActiveIndex(nextIndex);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const previousSlide = () => {
    goToSlide(activeIndex - 1);
  };

  /*
   * Automatically move to the next menu
   * image every 5 seconds.
   */
  useEffect(() => {
    const interval = window.setInterval(() => {
      nextSlide();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [nextSlide]);

  /*
   * Keep the dots/index synchronized when
   * the user manually swipes or scrolls.
   */
  const handleScroll = () => {
    const carousel = carouselRef.current;

    if (!carousel || carousel.clientWidth === 0) {
      return;
    }

    const index = Math.round(
      carousel.scrollLeft / carousel.clientWidth
    );

    if (
      index >= 0 &&
      index < menuImages.length &&
      index !== activeIndex
    ) {
      setActiveIndex(index);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-fuchsia-300">
              BO BOWLING
            </p>

            <h1 className="mt-1 text-xl font-semibold">
              Café Menu
            </h1>
          </div>

          <Link
            href="/#experience"
            className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-14 md:px-8 md:pb-12 md:pt-20">
        <p className="text-sm uppercase tracking-[0.45em] text-gray-500">
          BO BOWLING CAFÉ
        </p>

        <h2 className="mt-5 max-w-4xl text-5xl font-bold leading-[0.95] md:text-7xl">
          Something For
          <br />
          Every Moment.
        </h2>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-400">
          Coffee, mojitos, refreshments, hot drinks and more.
        </p>
      </section>

      {/* CAROUSEL */}
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="
              flex
              snap-x
              snap-mandatory
              overflow-x-auto
              scroll-smooth
              rounded-2xl
              [-ms-overflow-style:none]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {menuImages.map((image) => (
              <div
                key={image.src}
                className="min-w-full snap-center"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1536}
                    height={1024}
                    priority={image.src === menuImages[0].src}
                    sizes="(max-width: 1280px) 100vw, 1200px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* LEFT ARROW */}
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous menu"
            className="
              absolute
              left-3
              top-1/2
              z-20
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-black/60
              text-2xl
              backdrop-blur-md
              transition
              hover:bg-white
              hover:text-black
              md:left-5
            "
          >
            ‹
          </button>

          {/* RIGHT ARROW */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next menu"
            className="
              absolute
              right-3
              top-1/2
              z-20
              flex
              h-12
              w-12
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-black/60
              text-2xl
              backdrop-blur-md
              transition
              hover:bg-white
              hover:text-black
              md:right-5
            "
          >
            ›
          </button>
        </div>

        {/* CONTROLS */}
        <div className="mt-6 flex items-center justify-between gap-6">
          <p className="text-sm text-gray-500">
            {activeIndex + 1} / {menuImages.length}
          </p>

          <div className="flex items-center gap-2">
            {menuImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`View menu ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <p className="hidden text-sm text-gray-500 sm:block">
            Swipe or scroll
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-gray-600">
        BO Bowling · Sohar, Oman
      </footer>
    </main>
  );
}