"use client";
import { useEffect, useState } from "react";
import { usePlayerStore } from "@/lib/store";

// This flashes a red background for 2s when a new song starts playing
export default function RightBgFlash({ triggerKey }: { triggerKey: any }) {
  const [flash, setFlash] = useState(false);
  const { isPlaying } = usePlayerStore();

  useEffect(() => {
    if (isPlaying) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 1200); // match animation duration
      return () => clearTimeout(timeout);
    }
  }, [triggerKey, isPlaying]);

  return (
    <div
      className={`absolute inset-0 z-0 transition-colors duration-700 ${flash ? "bg-[#8b1818]" : "bg-black"}`}
      aria-hidden="true"
    />
  );
}
