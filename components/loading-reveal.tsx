"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingReveal() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide after 2 seconds (adjust as needed)
    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60vw" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="h-1 rounded-full"
            style={{ background: "#8b1818" }} // Use the left partition red
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
