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

export default function SceneTransition({
  children,
}: SceneTransitionProps) {
  const scenes = Children.toArray(children);

  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);

  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    triggerRefs.current.forEach((trigger, index) => {
      if (!trigger) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting &&
            activeIndex === index &&
            nextIndex === null
          ) {
            setNextIndex(index + 1);

            setTimeout(() => {
              setActiveIndex(index + 1);
              setNextIndex(null);
            }, 1500);

            observer.disconnect();
          }
        },
        {
          threshold: 0,
        }
      );

      observer.observe(trigger);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [activeIndex, nextIndex]);

  const currentScene = scenes[activeIndex];

  const nextScene =
    nextIndex !== null
      ? scenes[nextIndex]
      : null;

  const totalHeight =
    100 + Math.max(scenes.length - 1, 1) * 180;

  return (
    <section
      className="relative bg-black"
      style={{ height: `${totalHeight}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* CURRENT SCENE */}
        <motion.div
          key={`scene-${activeIndex}`}
          className="absolute inset-0 overflow-hidden"
          animate={
            nextIndex !== null
              ? {
                  opacity: 0,
                  scale: 1.06,
                  filter: "blur(8px)",
                }
              : {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }
          }
          transition={{
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="h-screen overflow-hidden">
            {currentScene}
          </div>
        </motion.div>

        {/* NEXT SCENE */}
        {nextScene && (
          <motion.div
            key={`scene-${nextIndex}`}
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
          >
            <div className="h-screen overflow-hidden">
              {nextScene}
            </div>
          </motion.div>
        )}

      </div>

      {/* TRANSITION TRIGGERS */}
      {scenes.slice(0, -1).map((_, index) => (
        <div
          key={index}
          ref={(element) => {
            triggerRefs.current[index] = element;
          }}
          className="absolute left-0 h-px w-full"
          style={{
            top: `${180 * (index + 1)}vh`,
          }}
        />
      ))}
    </section>
  );
}