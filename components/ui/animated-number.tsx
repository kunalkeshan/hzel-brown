"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface AnimatedNumberProps {
  value: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({
  value,
  formatValue,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, {
    damping: 25,
    stiffness: 400,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [spring]);

  const formattedValue = formatValue
    ? formatValue(displayValue)
    : displayValue.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

  return (
    <motion.span
      className={className}
      key={value}
      initial={{ opacity: 0.8, y: -1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {formattedValue}
    </motion.span>
  );
}
