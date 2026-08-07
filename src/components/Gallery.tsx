"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = [
  {
    src: "/images/lanes_wide2.jpg",
    alt: "BO Bowling lanes",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/billiards2.jpg",
    alt: "Billiards at BO Bowling",
    className: "",
  },
  {
    src: "/images/coffee1.jpg",
    alt: "BO Bowling café",
    className: "",
  },
  {
    src: "/images/foosball2.jpg",
    alt: "Foosball at BO Bowling",
    className: "",
  },
  {
    src: "/images/seating.jpg",
    alt: "Seating area at BO Bowling",
    className: "",
  },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-black px-5 py-32 text-white md:px-8 md:py-40"
    >
        {/* BO BRAND MARK */}
<div className="pointer-events-none absolute right-[-30px] top-6 h-[380px] w-[480px] opacity-[0.14] md:right-[-20px] md:h-[430px] md:w-[540px]">  <Image
    src="/images/bo-logo-transparent.png"
    alt=""
    fill
    sizes="700px"
    className="object-contain"
  />
</div>

{/* AMBIENT BRAND GLOW */}
<div className="pointer-events-none absolute right-[-200px] top-0 h-[700px] w-[700px] rounded-full bg-fuchsia-600/10 blur-[170px]" />

<div className="pointer-events-none absolute -left-60 bottom-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[170px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-16"
        >
          <p className="mb-5 text-sm uppercase tracking-[0.45em] text-gray-500">
            BO BOWLING
          </p>

          <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            More Than
            <br />A Game.
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
            Bowling, gaming, coffee and competition — all in one place.
          </p>
        </motion.div>

        <div className="grid auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[300px]">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.98,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.9,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-2xl ${image.className}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/5" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
