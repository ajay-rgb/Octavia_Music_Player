"use client";
import { motion } from "framer-motion";
import { usePlayerStore } from "@/lib/store";

interface AnimatedThumbnailProps {
  src: string;
  alt: string;
  keyTrigger: any; // Change on new song to trigger animation
  onceOnly?: boolean;
}

import { useEffect, useState } from "react";

export default function AnimatedThumbnail({ src, alt, keyTrigger, onceOnly }: AnimatedThumbnailProps) {
  const { isPlaying } = usePlayerStore();
  const [playAnim, setPlayAnim] = useState(false);

  useEffect(() => {
    if (isPlaying && onceOnly) {
      setPlayAnim(false);
      const t = setTimeout(() => setPlayAnim(true), 10);
      return () => clearTimeout(t);
    }
    if (!isPlaying && onceOnly) {
      setPlayAnim(false);
    }
  }, [keyTrigger, isPlaying, onceOnly]);

  const animate = onceOnly
    ? (playAnim
        ? {
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ["6%", "6%", "50%", "50%", "6%"],
          }
        : {})
    : (isPlaying
        ? {
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ["6%", "6%", "50%", "50%", "6%"],
          }
        : {});

  const transition = onceOnly && playAnim
    ? {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: 0,
      }
    : (!onceOnly && isPlaying
        ? {
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }
        : {});

  return (
    <motion.img
      src={src}
      alt={alt}
      width={256}
      height={256}
      className="rounded-2xl shadow-lg object-cover"
      animate={animate}
      transition={transition}
      style={{ zIndex: 20 }}
      key={keyTrigger} // re-trigger on song change
    />
  );
}
