"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { faArrowRight, faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const HeroDiv = () => {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="m-auto max-w-[1200px] px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden"
    >
      {/* LEFT CONTENT */}
      <div className="flex-1 flex flex-col gap-6 max-w-[520px]">
        <motion.h1
          variants={item}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-textPrimary"
        >
          Build Your Perfect Hackathon Team — Faster
        </motion.h1>

        <motion.p
          variants={item}
          className="text-gray-400 text-lg leading-relaxed"
        >
          Turn ideas into winning hackathon teams — faster and smarter.
        </motion.p>

        {/* CTA */}
        <motion.div variants={item} className="flex flex-wrap gap-4">
          <Link
            href="/teams"
            className="px-8 py-3 rounded-lg font-medium
                      bg-gradient-to-r from-purple-500 to-indigo-500 
                     text-white
                      hover:scale-105 active:scale-95 
                      shadow-lg shadow-purple-800/20  text-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faRocket} />
            &nbsp; Get Started Free
          </Link>

          <Link
            href="#features"
            className="border border-textBgPrimaryHv text-textSecondary px-6 py-3 rounded-lg shadow-lg shadow-purple-800/20  text-center gap-2 hover:shadow-xl transition-all duration-300"
          >
            Explore Features &nbsp;
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </motion.div>

        {/* TRUST TEXT */}
        <motion.div variants={item} className="flex flex-col gap-1 mt-2">
          <p className="text-sm text-gray-400">
            ✅ Free to use • ⚡ Built for hackathons • 🤝 Real-time
            collaboration
          </p>
          <p className="text-sm text-gray-500">👥 Trusted by 25+ early users</p>
        </motion.div>
      </div>

      {/* RIGHT IMAGE */}
      <motion.div
        variants={item}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex justify-center"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-purple-500/20 blur-[120px] rounded-full overflow-hidden" />

          <Image
            src="/hero-img.png"
            alt="findYourHackathonMates"
            width={600}
            height={800}
            className="relative z-10 rounded-xl"
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroDiv;
