"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
  initScale?: number;
}

export function ScaleIn({
  children,
  delay = 0,
  className = "",
  duration = 0.5,
  initScale = 0.8,
}: ScaleInProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: initScale,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
        type: "spring",
        stiffness: 120,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
