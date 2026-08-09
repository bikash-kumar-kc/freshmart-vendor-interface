import React from "react";
import { motion } from "framer-motion";

interface MotionStaggerProps {
  idx: number;
  children: React.ReactNode;
  isWindowView?: boolean;
}

const MotionStagger = ({
  idx,
  children,
  isWindowView = true,
}: MotionStaggerProps) => {
  const Component = isWindowView ? motion.div : motion.tr;

  return (
    <Component
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: idx * 0.15,
        ease: "easeOut",
      }}
    >
      {children}
    </Component>
  );
};

export default MotionStagger;
