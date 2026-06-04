"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Compass, Trophy, ArrowUpRight } from "lucide-react";

interface HeroTileProps {
  userName: string;
  totalXP: number;
  streak: number;
}

export default function HeroTile({ userName, totalXP, streak }: HeroTileProps) {
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const rankProgress = Math.round(((totalXP % 1000) / 1000) * 100);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.article
      variants={itemVariants}
      className="group relative lg:col-span-2 glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden h-72 md:h-64 cursor-pointer"
      whileHover={{
        scale: 1.015,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      <div className="absolute inset-0 border border-zinc-800/80 rounded-3xl group-hover:border-accent-purple/30 transition-colors duration-300 pointer-events-none" />
      <div className="absolute inset-0 mesh-glow-purple opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="grain-overlay" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent-purple px-2 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/20">
              Active Session
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-semibold">
              <Compass className="h-3 w-3 text-accent-cyan animate-pulse" />
              Level {currentLevel} Architect
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight mt-1">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-purple to-accent-cyan animate-text">{userName.trim().split(" ")[0]}</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-md font-medium leading-relaxed">
            You've completed 4 tasks this week. Keep up the momentum to secure your spot in the top 5% of your cohort.
          </p>
        </div>

        <div className="h-9 w-9 rounded-full bg-zinc-900/60 border border-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-950 transition-all duration-300 shrink-0">
          <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-4 mt-4 md:mt-0 items-center justify-between border-t border-zinc-900/60 pt-4">
        {/* streak widget */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute -inset-1 rounded-full bg-orange-500/20 blur-sm animate-pulse-slow" />
            <div className="relative h-11 w-11 rounded-xl bg-orange-950/40 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-950/20">
              <Flame className="h-6 w-6 text-orange-500 fill-orange-500/30 animate-bounce" style={{ animationDuration: "2s" }} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">{streak}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Days</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-semibold">Daily Study Streak</p>
          </div>
        </div>

        {/* level progress */}
        <div className="flex items-center gap-3 flex-1 max-w-[200px]">
          <div className="h-11 w-11 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center shadow-md shrink-0">
            <Trophy className="h-5 w-5 text-accent-purple" />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center text-[10px] mb-1 font-semibold text-zinc-400">
              <span>{totalXP} XP</span>
              <span>Lvl {currentLevel + 1}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/20">
              <motion.div 
                className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${rankProgress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
