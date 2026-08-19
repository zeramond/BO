"use client";

import {
  Children,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

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
  const targetIndexRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [nextIndex, setNextIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect = section.getBoundingClientRect();
      const distanceIntoSection = Math.max(0, -rect.top);
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const introDistance = window.innerHeight * INTRO_HOLD;

      if (distanceIntoSection < introDistance) {
        targetIndexRef.current = -1;
        setNextIndex(activeIndex === -1 ? null : -1);
        return;
      }

      const sceneDistance = scrollableDistance - introDistance;

      if (sceneDistance <= 0) return;

      const progress = Math.min(
        Math.max(
          (distanceIntoSection - introDistance) / sceneDistance,
          0,
        ),
        0.999999,
      );

      const newIndex = Math.min(
        Math.floor(progress * scenes.length),
        scenes.length - 1,
      );

      targetIndexRef.current = newIndex;
      setNextIndex(activeIndex === newIndex ? null : newIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeIndex, scenes.length]);

  const completeTransition = (index: number) => {
    if (targetIndexRef.current !== index) return;

    setActiveIndex(index);
    setNextIndex(null);
  };

  const isTransitioning = nextIndex !== null && nextIndex !== activeIndex;
  const currentScene = activeIndex >= 0 ? scenes[activeIndex] : null;
  const incomingIndex =
    nextIndex !== null && nextIndex >= 0 ? nextIndex : null;
  const nextScene = incomingIndex !== null ? scenes[incomingIndex] : null;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="pointer-events-none relative"
      style={{
        height: `${scenes.length * SCENE_HEIGHT}vh`,
      }}
    >
      <div
        className={`sticky top-0 h-screen overflow-hidden transition-[z-index] ${
          activeIndex >= 0 || nextScene
            ? "pointer-events-auto z-30"
            : "pointer-events-none z-0"
        }`}
      >
        {currentScene && (
          <motion.div
            key={`scene-${activeIndex}`}
            className="absolute inset-0 overflow-hidden"
            initial={false}
            animate={
              isTransitioning
                ? {
                    opacity: 0,
                    scale: 1.06,
                    filter: "blur(10px)",
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                  }
            }
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={
              nextIndex === -1
                ? () => completeTransition(-1)
                : undefined
            }
          >
            <div className="h-screen overflow-hidden">
              {currentScene}
            </div>
          </motion.div>
        )}

        {nextScene && incomingIndex !== activeIndex && (
          <motion.div
            key={`scene-${incomingIndex}`}
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
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              if (incomingIndex !== null) {
                completeTransition(incomingIndex);
              }
            }}
          >
            <div className="h-screen overflow-hidden">
              {nextScene}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
