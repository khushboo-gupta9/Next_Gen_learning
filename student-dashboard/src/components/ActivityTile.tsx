"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Calendar, Award, TrendingUp } from "lucide-react";
import { StudySession } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface ActivityTileProps {
  studyAnalytics: StudySession[];
}

export default function ActivityTile({ studyAnalytics }: ActivityTileProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    index: number;
    minutes: number;
    date: string;
    x: number;
    y: number;
  } | null>(null);

  const [hoveredChartPoint, setHoveredChartPoint] = useState<{
    dayName: string;
    minutes: number;
    date: string;
    x: number;
    y: number;
  } | null>(null);

  const data = studyAnalytics || [];

  // group dates by columns for 15-week chart
  const columns: StudySession[][] = [];
  let currentWeek: StudySession[] = [];

  data.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      columns.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    columns.push(currentWeek);
  }

  // calc tooltip positioning for heatmap cell
  const handleCellMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    day: StudySession,
    idx: number
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setHoveredCell({
        index: idx,
        minutes: day.minutes_studied,
        date: new Date(day.session_date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 45,
      });
    }
  };

  const last7Days = data.slice(-7);
  
  const totalStudyMinutes = data.reduce((acc, curr) => acc + curr.minutes_studied, 0);
  const totalHours = Math.round(totalStudyMinutes / 60);

  const weeklyMinutes = last7Days.reduce((acc, curr) => acc + curr.minutes_studied, 0);
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);
  const weeklyXP = last7Days.reduce((acc, curr) => acc + curr.xp_earned, 0);

  // sparkline svg configuration
  const svgWidth = 240;
  const svgHeight = 90;
  const maxMins = Math.max(...last7Days.map((d) => d.minutes_studied), 60);

  const points = last7Days.map((day, idx) => {
    const x = (idx / 6) * (svgWidth - 20) + 10;
    const y = svgHeight - ((day.minutes_studied / maxMins) * (svgHeight - 30) + 15);
    return { x, y, day };
  });

  const linePath = points.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`;
  }, "");

  const fillPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`
    : "";

  const handlePointMouseEnter = (
    e: React.MouseEvent<SVGCircleElement>,
    p: typeof points[number]
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
    if (parentRect) {
      const dateObj = new Date(p.day.session_date);
      setHoveredChartPoint({
        dayName: dateObj.toLocaleDateString(undefined, { weekday: "short" }),
        minutes: p.day.minutes_studied,
        date: dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 45,
      });
    }
  };

  const getItemLevel = (mins: number) => {
    if (mins === 0) return 0;
    if (mins <= 30) return 1;
    if (mins <= 60) return 2;
    if (mins <= 90) return 3;
    return 4;
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
    <motion.article
      variants={itemVariants}
      className="group relative lg:col-span-3 glass-panel rounded-3xl p-6 flex flex-col justify-between overflow-hidden min-h-80 lg:min-h-72 cursor-pointer"
      whileHover={{
        scale: 1.01,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      <div className="absolute inset-0 border border-zinc-800/80 rounded-3xl group-hover:border-accent-emerald/30 transition-colors duration-300 pointer-events-none" />
      <div className="absolute inset-0 mesh-glow-emerald opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
      <div className="grain-overlay" />

      <div className="relative z-10 flex justify-between items-start border-b border-zinc-900/60 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="h-4 w-4 text-accent-emerald" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Study Analytics</h3>
          </div>
          <h2 className="text-lg font-black text-white">Daily Focus Graph</h2>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-md font-black text-accent-emerald flex items-center gap-1 justify-end">
              <Award className="h-4 w-4 shrink-0" />
              {totalHours} hrs
            </div>
            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">All-Time Study</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-6 my-4 items-center flex-1">
        {/* sparkline visual representation */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full bg-zinc-950/40 border border-zinc-900/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-accent-emerald" />
              Weekly Intensity
            </h4>
            <span className="text-[9px] text-zinc-500 font-bold bg-zinc-900 px-2 py-0.5 rounded-full">
              {weeklyHours} hrs • +{weeklyXP} XP
            </span>
          </div>

          <div className="relative w-full flex items-center justify-center py-2 h-[90px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full overflow-visible">
              <defs>
                <linearGradient id="emerald-glow-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              <line x1="0" y1={svgHeight - 15} x2={svgWidth} y2={svgHeight - 15} stroke="#18181b" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="0" y1={svgHeight / 2} x2={svgWidth} y2={svgHeight / 2} stroke="#18181b" strokeWidth="1" strokeDasharray="2 2" />

              {fillPath && <path d={fillPath} fill="url(#emerald-glow-area)" />}

              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_6px_rgba(16,185,129,0.35)]"
                />
              )}

              {points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200 hover:r-6 hover:fill-accent-emerald"
                  onMouseEnter={(e) => handlePointMouseEnter(e, p)}
                  onMouseLeave={() => setHoveredChartPoint(null)}
                />
              ))}
            </svg>

            <AnimatePresence>
              {hoveredChartPoint && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute pointer-events-none z-30 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 shadow-xl text-center flex flex-col items-center justify-center shrink-0 w-28"
                  style={{
                    left: `${hoveredChartPoint.x - 56}px`,
                    top: `${hoveredChartPoint.y}px`,
                  }}
                >
                  <span className="text-[9px] text-zinc-400 font-bold">
                    {hoveredChartPoint.dayName} • {hoveredChartPoint.date}
                  </span>
                  <span className="text-[11px] font-black text-accent-emerald mt-0.5">
                    {hoveredChartPoint.minutes} mins
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center text-[9px] text-zinc-500 font-black uppercase mt-1 px-1">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>
        </div>

        {/* heatmap grid */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full relative">
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none self-end max-w-full">
            <div className="flex flex-col justify-between text-[9px] text-zinc-600 font-bold pr-1 pt-1.5 pb-2">
              <span>M</span>
              <span>W</span>
              <span>F</span>
            </div>

            <div className="flex gap-1.5 flex-1">
              {columns.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((day, dIdx) => {
                    const cellIdx = wIdx * 7 + dIdx;
                    const level = getItemLevel(day.minutes_studied);
                    return (
                      <div
                        key={dIdx}
                        className={cn(
                          "h-3.5 w-3.5 rounded-[3px] transition-all duration-300 cursor-pointer relative",
                          level === 0 && "bg-zinc-950 border border-zinc-900/60 hover:bg-zinc-900",
                          level === 1 && "bg-accent-emerald/10 border border-accent-emerald/5 hover:bg-accent-emerald/20",
                          level === 2 && "bg-accent-emerald/30 hover:bg-accent-emerald/40",
                          level === 3 && "bg-accent-emerald/60 hover:bg-accent-emerald/70",
                          level === 4 && "bg-accent-emerald hover:bg-emerald-400 shadow-md shadow-accent-emerald/20"
                        )}
                        onMouseEnter={(e) => handleCellMouseEnter(e, day, cellIdx)}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {hoveredCell && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute pointer-events-none z-30 bg-zinc-950/95 border border-zinc-800 rounded-lg px-2.5 py-1.5 shadow-xl text-center flex flex-col items-center justify-center shrink-0 w-36"
                style={{
                  left: `${hoveredCell.x - 72}px`,
                  top: `${hoveredCell.y}px`,
                }}
              >
                <span className="text-[9px] text-zinc-400 font-semibold">{hoveredCell.date}</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  <Flame className="h-3 w-3 text-orange-500 fill-orange-500/20" />
                  {hoveredCell.minutes} mins studied
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-zinc-900/60 pt-3">
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
          <Flame className="h-3 w-3 text-amber-500 fill-amber-500/20" />
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
