"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Course } from "@/types";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  index: number;
}

// Map of glow gradient classes based on the index to create a colorful, premium dashboard.
const MESH_GLOW_THEMES = [
  {
    borderHover: "group-hover:border-accent-purple/30",
    mesh: "mesh-glow-purple",
    badge: "text-accent-purple bg-accent-purple/10 border-accent-purple/20",
    bar: "bg-gradient-to-r from-accent-purple to-purple-400",
    icon: "text-accent-purple bg-accent-purple/5 border-accent-purple/10",
  },
  {
    borderHover: "group-hover:border-accent-cyan/30",
    mesh: "mesh-glow-cyan",
    badge: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20",
    bar: "bg-gradient-to-r from-accent-cyan to-cyan-400",
    icon: "text-accent-cyan bg-accent-cyan/5 border-accent-cyan/10",
  },
  {
    borderHover: "group-hover:border-accent-emerald/30",
    mesh: "mesh-glow-emerald",
    badge: "text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20",
    bar: "bg-gradient-to-r from-accent-emerald to-emerald-400",
    icon: "text-accent-emerald bg-accent-emerald/5 border-accent-emerald/10",
  },
  {
    borderHover: "group-hover:border-accent-amber/30",
    mesh: "mesh-glow-amber",
    badge: "text-accent-amber bg-accent-amber/10 border-accent-amber/20",
    bar: "bg-gradient-to-r from-accent-amber to-amber-400",
    icon: "text-accent-amber bg-accent-amber/5 border-accent-amber/10",
  },
];

export default function CourseCard({ course, index }: CourseCardProps) {
  // Resolve theme configuration cyclically
  const theme = MESH_GLOW_THEMES[index % MESH_GLOW_THEMES.length];

  // Resolve Lucide icon component dynamically
  const IconComponent = (Icons as any)[course.icon_name] || Icons.BookOpen;

  // Animation variant for the entrance animation (which is staggered by the parent layout component)
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
      className="group relative glass-panel rounded-3xl p-6 h-64 flex flex-col justify-between overflow-hidden cursor-pointer"
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Dynamic Glow Borders */}
      <div className={cn(
        "absolute inset-0 border border-zinc-800/80 rounded-3xl transition-colors duration-300 pointer-events-none",
        theme.borderHover
      )} />

      {/* Abstract mesh glow backdrop */}
      <div className={cn(
        "absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none",
        theme.mesh
      )} />
      <div className="grain-overlay" />

      {/* Header section (Icon + Completion Badge) */}
      <div className="relative z-10 flex justify-between items-start">
        <div className={cn(
          "h-12 w-12 rounded-2xl border flex items-center justify-center shadow-inner transition-colors duration-300 shrink-0",
          theme.icon,
          "group-hover:bg-zinc-950/40"
        )}>
          <IconComponent className="h-6 w-6 stroke-[1.8]" />
        </div>
        <span className={cn(
          "text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full border shadow-sm",
          theme.badge
        )}>
          {course.progress === 100 ? "Completed" : "In Progress"}
        </span>
      </div>

      {/* Body section (Title + Activity timestamp) */}
      <div className="relative z-10 mt-4 space-y-1">
        <h3 className="text-md font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 transition-all duration-200 line-clamp-2 leading-snug">
          {course.title}
        </h3>
        <p className="text-[10px] text-zinc-500 font-semibold tracking-wide flex items-center gap-1">
          <Icons.Clock className="h-3 w-3 inline" />
          Active this week
        </p>
      </div>

      {/* Footer section (Animated Progress Bar) */}
      <div className="relative z-10 mt-4 space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-zinc-400">Course Progress</span>
          <span className="text-white font-bold">{course.progress}%</span>
        </div>
        
        {/* Custom Progress Bar Wrapper */}
        <div className="h-2 w-full bg-zinc-950/50 rounded-full overflow-hidden border border-zinc-900/50">
          <motion.div
            className={cn("h-full rounded-full", theme.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{
              type: "spring" as const,
              stiffness: 80,
              damping: 15,
              delay: 0.2 + index * 0.1, // Slight stagger to the bar fills as cards load
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}
