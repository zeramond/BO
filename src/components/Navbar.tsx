"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fade-down delay-5 fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold tracking-wide text-white">
          BO Bowling
        </h1>

        <div className="hidden items-center gap-8 text-white md:flex">
          <a href="#" className="transition hover:text-gray-300">
            Home
          </a>

          <a href="#" className="transition hover:text-gray-300">
            Experience
          </a>

          <a href="#" className="transition hover:text-gray-300">
            Gallery
          </a>

          <a href="#" className="transition hover:text-gray-300">
            Contact
          </a>

          <button className="rounded-full border border-white px-5 py-2 transition hover:bg-white hover:text-black">
            Reserve
          </button>
        </div>
      </div>
    </nav>
  );
}