"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import { Course } from "@/types";
import { StudySession } from "@/lib/supabase";
import HeroTile from "@/components/HeroTile";
import CourseCard from "@/components/CourseCard";
import ActivityTile from "@/components/ActivityTile";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  courses: Course[];
  studyAnalytics: StudySession[];
  onSelectCourse?: (course: Course) => void;
  userName: string;
  totalXP: number;
  streak: number;
}

export default function BentoGrid({
  courses,
  studyAnalytics,
  onSelectCourse,
  userName,
  totalXP,
  streak
}: BentoGridProps) {
  // simple spring entrance animation config
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

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
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {/* 1. Hero Welcome Card */}
      <HeroTile userName={userName} totalXP={totalXP} streak={streak} />

      {/* 2. Course Widgets */}
      {courses[0] && <CourseCard course={courses[0]} index={0} onClick={() => onSelectCourse?.(courses[0])} />}
      {courses[1] && <CourseCard course={courses[1]} index={1} onClick={() => onSelectCourse?.(courses[1])} />}
      {courses[2] && <CourseCard course={courses[2]} index={2} onClick={() => onSelectCourse?.(courses[2])} />}
      {courses[3] && <CourseCard course={courses[3]} index={3} onClick={() => onSelectCourse?.(courses[3])} />}

      {/* 3. Study Analytics Heatmap */}
      <ActivityTile studyAnalytics={studyAnalytics} />

      {/* 4. Cohort Ranking Leaderboard */}
      <motion.article
        variants={itemVariants}
        className="group relative glass-panel rounded-3xl p-6 flex flex-col justify-between overflow-hidden h-72 md:h-64 cursor-pointer"
        whileHover={{
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
      >
        <div className="absolute inset-0 border border-zinc-800/80 rounded-3xl group-hover:border-accent-rose/30 transition-colors duration-300 pointer-events-none" />
        <div className="absolute inset-0 mesh-glow-rose opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
        <div className="grain-overlay" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <Trophy className="h-4 w-4 text-accent-rose" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Cohort Ranking</h3>
            </div>
            <h2 className="text-md font-bold text-white leading-snug">Top Cohort Performers</h2>
          </div>

          {/* cohort list */}
          <div className="space-y-3 my-3">
            {[
              { rank: 1, name: "Aarav Sharma", xp: Math.max(totalXP + 480, 1420), active: true },
              { rank: 2, name: userName || "Khushboo Gupta", xp: totalXP, active: false, self: true },
              { rank: 3, name: "Ananya Iyer", xp: Math.max(totalXP - 50, 890), active: false },
            ].map((user) => (
              <div
                key={user.rank}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xl border transition-all duration-300",
                  user.self
                    ? "bg-accent-rose/10 border-accent-rose/30"
                    : "bg-zinc-950/40 border-zinc-900/60"
                )}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                    user.rank === 1 && "bg-amber-500 text-black",
                    user.rank === 2 && "bg-zinc-300 text-black",
                    user.rank === 3 && "bg-amber-800 text-white"
                  )}>
                    {user.rank}
                  </span>
                  <span className={cn(
                    "text-xs font-bold truncate",
                    user.self ? "text-accent-rose" : "text-zinc-300"
                  )}>
                    {user.name} {user.self && " (You)"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-black text-white">{user.xp} XP</span>
                  {user.active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
            <span>Week 4 of 12</span>
            <span className="text-accent-rose hover:underline flex items-center gap-0.5">
              View board <TrendingUp className="h-3 w-3 inline" />
            </span>
          </div>
        </div>
      </motion.article>
    </motion.section>
  );
}
