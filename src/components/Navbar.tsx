"use client";

import { useEffect, useState } from "react";

import TrackedReserveLink from "@/components/TrackedReserveLink";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fade-down delay-5 fixed left-0 top-0 z-[100] w-full transition-all duration-300 ${
          scrolled || menuOpen
            ? "border-b border-white/10 bg-black/80 shadow-lg backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
          <a
            href="#home"
            onClick={closeMenu}
            className="text-2xl font-bold tracking-wide text-white"
          >
            BO Bowling
          </a>

          {/* DESKTOP */}
          <div className="hidden items-center gap-8 text-white md:flex">
            <a href="#home" className="transition hover:text-gray-300">
              Home
            </a>

            <a href="#experience" className="transition hover:text-gray-300">
              Experience
            </a>

            <a href="#gallery" className="transition hover:text-gray-300">
              Gallery
            </a>

            <a href="#contact" className="transition hover:text-gray-300">
              Contact
            </a>

            <TrackedReserveLink
              placement="desktop_nav"
              className="rounded-full border border-white px-5 py-2 transition hover:bg-white hover:text-black"
            >
              Check Availability
            </TrackedReserveLink>
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            className="relative z-[110] flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
          >
            <span
              className={`h-[2px] w-6 bg-white transition duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`h-[2px] w-6 bg-white transition duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`h-[2px] w-6 bg-white transition duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[90] flex bg-black transition-all duration-500 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex w-full flex-col justify-center px-8">
          <div className="flex flex-col gap-7">
            <a
              href="#home"
              onClick={closeMenu}
              className="text-5xl font-semibold text-white"
            >
              Home
            </a>

            <a
              href="#experience"
              onClick={closeMenu}
              className="text-5xl font-semibold text-white"
            >
              Experience
            </a>

            <a
              href="#gallery"
              onClick={closeMenu}
              className="text-5xl font-semibold text-white"
            >
              Gallery
            </a>

            <a
              href="#contact"
              onClick={closeMenu}
              className="text-5xl font-semibold text-white"
            >
              Contact
            </a>
          </div>

          <div className="mt-12">
            <TrackedReserveLink
              placement="mobile_menu"
              onClick={closeMenu}
              className="inline-flex rounded-full bg-white px-8 py-4 font-semibold text-black"
            >
              Check Pricing & Availability
            </TrackedReserveLink>
          </div>

          <p className="mt-16 text-xs uppercase tracking-[0.4em] text-gray-600">
            BO Bowling · Sohar
          </p>
        </div>
      </div>

      <TrackedReserveLink
        placement="mobile_sticky"
        className={`fixed bottom-4 left-4 right-4 z-[80] flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-2xl transition md:hidden ${
          menuOpen ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
        }`}
      >
        Check Pricing & Availability
      </TrackedReserveLink>
    </>
  );
}
