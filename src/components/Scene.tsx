"use client";

import { ReactNode, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

type SceneProps = {
  image: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  height?: string;
};

export default function Scene({
  image,
  eyebrow,
  title,
  description,
  children,
  height = "200vh",
}: SceneProps) {
  const controls = useAnimation();
  const textControls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration: 1.6,
              ease: [0.22, 1, 0.36, 1],
            },
          });

          setTimeout(() => {
            textControls.start("visible");
          }, 700);

          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [controls, textControls]);

  return (
    <section
      ref={ref}
      className="relative bg-black"
      style={{ height }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          initial={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
          }}
          animate={controls}
        >
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-8">
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={textControls}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0 },
                  },
                }}
                className="mb-5 text-sm uppercase tracking-[0.45em] text-blue-300"
              >
                {eyebrow}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                animate={textControls}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.2 },
                  },
                }}
                className="max-w-3xl text-6xl font-bold leading-tight text-white md:text-8xl"
              >
                {title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={textControls}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.4 },
                  },
                }}
                className="mt-8 max-w-xl text-xl leading-8 text-gray-200"
              >
                {description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={textControls}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.6 },
                  },
                }}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}