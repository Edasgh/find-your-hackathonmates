"use client";
import { motion } from "framer-motion";

export default function Reveal({ children, className }) {
  return (
    <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.96, filter: "blur(8px)" }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ width: "100%" }}
  
      className={className}
    >
      {children}
    </motion.div>
  );
}
