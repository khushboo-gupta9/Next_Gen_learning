"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Flame, Calendar, Award } from "lucide-react";
import { cn } from "@/lib/utils";

// Generate mock daily activity levels for 15 weeks (15 * 7 = 105 days)
const DAYS_OF_WEEK = ["Mon", "Wed", "Fri"];
const ACTIVITY_LEVELS = [0, 1, 2, 3, 4]; // 0 = none, 4 = max study duration

// Seed random but reproducible activity details
const seedActivityData = () => {
  const data = [];
  const now = new Date();
  for (let i = 104; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // Simple deterministic pseudo-random formula
    const val = (i % 3 === 0 ? 1 : 0) + (i % 7 === 0 ? 2 : 0) + (i % 11 === 0 ? 1 : 0);
    const level = Math.min(val, 4) as typeof ACTIVITY_LEVELS[number];
    const minutes = level * 20 + (level > 0 ? (i % 15) : 0); // e.g. 0 to 95 mins
    
    data.push({
      date,
      level,
      minutes,
      dayIndex: date.getDay(),
    });
  }
  return data;
};

const ACTIVITY_DATA = seedActivityData();

export default function ActivityCard() {
  const [hoveredCell, setHoveredCell] = useState<{
    index: number;
    minutes: number;
    date: Date;
    x: number;
    y: number;
  } | null>(null);

  // Group data by columns (weeks)
  const columns: typeof ACTIVITY_DATA[] = [];
  let currentWeek: typeof ACTIVITY_DATA = [];

  ACTIVITY_DATA.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      columns.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    columns.push(currentWeek);
  }

  // Handle cell hover coordinates for tooltip placement
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    day: typeof ACTIVITY_DATA[number],
    idx: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setHoveredCell({
        index: idx,
        minutes: day.minutes,
        date: day.date,
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 45,
      });
    }
  };

  const totalStudyMinutes = ACTIVITY_DATA.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = Math.round(totalStudyMinutes / 60);

  return (
    <motion.article
      className="group relative lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between overflow-hidden h-72 md:h-64 cursor-pointer"
      whileHover={{
        scale: 1.015,
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      }}
    >
      {/* Decorative Glow Border */}
      <div className="absolute inset-0 border border-zinc-800/80 rounded-3xl group-hover:border-accent-emerald/30 transition-colors duration-300 pointer-events-none" />

      {/* Mesh Glow Background */}
      <div className="absolute inset-0 mesh-glow-emerald opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
      <div className="grain-overlay" />

      {/* Header Info */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="h-4 w-4 text-accent-emerald" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Study Analytics</h3>
          </div>
          <h2 className="text-lg font-black text-white">Daily Focus Graph</h2>
          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
            Intensity matches daily learning minutes
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-lg font-black text-accent-emerald flex items-center gap-1 justify-end">
              <Award className="h-4 w-4 shrink-0" />
              {totalHours} hrs
            </div>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Total Time Studied</p>
          </div>
        </div>
      </div>

      {/* Contribution Grid Container */}
      <div className="relative z-10 my-4 flex-1 flex flex-col justify-end">
        {/* Heat Map Grid */}
        <div className="relative flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {/* Day of Week Labels */}
          <div className="flex flex-col justify-between text-[9px] text-zinc-600 font-bold pr-1 pt-1.5 pb-2">
            <span>M</span>
            <span>W</span>
            <span>F</span>
          </div>

          {/* Grid Columns */}
          <div className="flex gap-1.5 flex-1">
            {columns.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day, dIdx) => {
                  const cellIdx = wIdx * 7 + dIdx;
                  return (
                    <div
                      key={dIdx}
                      className={cn(
                        "h-4 w-4 rounded-[4px] transition-all duration-300 cursor-pointer relative",
                        day.level === 0 && "bg-zinc-950 border border-zinc-900/60 hover:bg-zinc-900",
                        day.level === 1 && "bg-accent-emerald/10 border border-accent-emerald/5 hover:bg-accent-emerald/20",
                        day.level === 2 && "bg-accent-emerald/30 hover:bg-accent-emerald/40",
                        day.level === 3 && "bg-accent-emerald/60 hover:bg-accent-emerald/70",
                        day.level === 4 && "bg-accent-emerald hover:bg-emerald-400 shadow-md shadow-accent-emerald/20"
                      )}
                      onMouseEnter={(e) => handleMouseEnter(e, day, cellIdx)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Interactive Tooltip */}
        <AnimatePresence>
          {hoveredCell && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-30 bg-zinc-950/95 border border-zinc-800 rounded-lg px-2.5 py-1.5 shadow-xl text-center flex flex-col items-center justify-center shrink-0 w-44"
              style={{
                left: `${hoveredCell.x - 88}px`, // Center the 176px wide tooltip
                top: `${hoveredCell.y}px`,
              }}
            >
              <span className="text-[10px] text-zinc-400 font-semibold">
                {hoveredCell.date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                <Flame className="h-3 w-3 text-orange-500 fill-orange-500/20" />
                {hoveredCell.minutes} mins studied
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid Legend */}
      <div className="relative z-10 flex items-center justify-between border-t border-zinc-900/60 pt-3">
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
          Active streak: 14 days in a row
        </span>
        <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-semibold">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded-[2px] bg-zinc-950 border border-zinc-900" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-accent-emerald/10" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-accent-emerald/30" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-accent-emerald/60" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-accent-emerald" />
          <span>More</span>
        </div>
      </div>
    </motion.article>
  );
}
