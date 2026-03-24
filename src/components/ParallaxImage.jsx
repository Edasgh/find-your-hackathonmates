"use client";
import { useScroll, useTransform, motion } from "framer-motion";

export default function ParallaxImage({ children, className }) {
  const { scrollYProgress } = useScroll();

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
