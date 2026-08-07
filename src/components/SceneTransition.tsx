"use client";

import {
  Children,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type SceneTransitionProps = {
  children: ReactNode;
};

const SCENE_HEIGHT = 160;
const INTRO_HOLD = 0.65;

export default function SceneTransition({
  children,
}: SceneTransitionProps) {
  const scenes = Children.toArray(children);

  const sectionRef = useRef<HTMLElement>(null);

  /*
   * -1 means:
   * keep showing the Hero underneath.
   */
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();

      const distanceIntoSection = Math.max(0, -rect.top);

      const scrollableDistance =
        section.offsetHeight - window.innerHeight;

      /*
       * Keep the Hero visible for the beginning
       * of the experience.
       */
      const introDistance =
        window.innerHeight * INTRO_HOLD;

      if (distanceIntoSection < introDistance) {
        setActiveIndex(-1);
        return;
      }

      /*
       * After the Hero hold,
       * divide the remaining scroll distance
       * between all venue scenes.
       */
      const sceneDistance =
        scrollableDistance - introDistance;

      if (sceneDistance <= 0) return;

      const progress = Math.min(
        Math.max(
          (distanceIntoSection - introDistance) /
            sceneDistance,
          0
        ),
        0.999999
      );

      const newIndex = Math.min(
        Math.floor(progress * scenes.length),
        scenes.length - 1
      );

      setActiveIndex((currentIndex) => {
        if (currentIndex === newIndex) {
          return currentIndex;
        }

        return newIndex;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scenes.length]);

  return (
    <section
      id = "experience"
      ref={sectionRef}
      className="pointer-events-none relative"
      style={{
        height: `${scenes.length * SCENE_HEIGHT}vh`,
      }}
    >
      <div
  className={`sticky top-0 h-screen overflow-hidden ${
    activeIndex >= 0
      ? "pointer-events-auto"
      : "pointer-events-none"
  }`}
>
  {/* Prevent the Hero from bleeding through between scenes */}
  {activeIndex >= 0 && (
    <div className="absolute inset-0 bg-black" />
  )}

  <AnimatePresence mode="sync">
          {activeIndex >= 0 && (
            <motion.div
              key={`scene-${activeIndex}`}
              className="absolute inset-0 overflow-hidden"
              initial={{
                opacity: 0,
                scale: 1.08,
                filter: "blur(16px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 1.06,
                filter: "blur(10px)",
              }}
              transition={{
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="h-screen overflow-hidden">
                {scenes[activeIndex]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}