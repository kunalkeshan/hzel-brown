"use client";

import * as motion from "motion/react-client";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export function MotionSection({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  y = 20,
}: MotionSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
