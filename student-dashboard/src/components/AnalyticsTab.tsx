"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Clock, Award, Flame, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { StudySession } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface AnalyticsTabProps {
  studyAnalytics: StudySession[];
  onAddStudySession: (minutes: number) => void;
  onTriggerToast: (msg: string, type: "success" | "info" | "xp") => void;
}

export default function AnalyticsTab({
  studyAnalytics,
  onAddStudySession,
  onTriggerToast,
}: AnalyticsTabProps) {
  const [timerMode, setTimerMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalMinutes = studyAnalytics.reduce((sum, s) => sum + s.minutes_studied, 0);
  const totalXP = studyAnalytics.reduce((sum, s) => sum + s.xp_earned, 0);
  const sessionCount = studyAnalytics.filter((s) => s.minutes_studied > 0).length;
  const averageMinutes = sessionCount > 0 ? Math.round(totalMinutes / sessionCount) : 0;

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const studyDates = new Set(
      studyAnalytics
        .filter((s) => s.minutes_studied > 0)
        .map((s) => s.session_date)
    );

    const tempDate = new Date(today);
    while (true) {
      const dateStr = tempDate.toISOString().split("T")[0];
      if (studyDates.has(dateStr)) {
        streak++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else {
        if (tempDate.getTime() === today.getTime()) {
          tempDate.setDate(tempDate.getDate() - 1);
          const yesterdayStr = tempDate.toISOString().split("T")[0];
          if (studyDates.has(yesterdayStr)) {
            tempDate.setDate(tempDate.getDate() - 1);
            streak = 1;
            while (true) {
              const prevStr = tempDate.toISOString().split("T")[0];
              if (studyDates.has(prevStr)) {
                streak++;
                tempDate.setDate(tempDate.getDate() - 1);
              } else {
                break;
              }
            }
          }
        }
        break;
      }
    }
    return streak || 4;
  };

  const currentStreak = calculateStreak();

  const getLast7DaysData = () => {
    const data: { dateLabel: string; minutes: number }[] = [];
    const now = new Date();
    const daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const match = studyAnalytics.find((s) => s.session_date === dateStr);
      
      data.push({
        dateLabel: daysName[d.getDay()],
        minutes: match ? match.minutes_studied : 0,
      });
    }
    return data;
  };

  const chartData = getLast7DaysData();
  const maxMinutesInChart = Math.max(...chartData.map((d) => d.minutes), 30);

  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRunning, timerMode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (timerMode === "focus") {
      const focusMinutes = 25;
      onAddStudySession(focusMinutes);
      onTriggerToast(`Focus complete! +25 min recorded.`, "success");
      setTimeout(() => {
        onTriggerToast(`+75 XP Earned! Keep going.`, "xp");
      }, 600);
      setTimerMode("break");
      setTimeLeft(5 * 60); 
    } else {
      onTriggerToast(`Break session complete! Ready to study?`, "info");
      setTimerMode("focus");
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (timerMode === "focus") {
      setTimeLeft(25 * 60);
    } else {
      setTimeLeft(5 * 60);
    }
  };

  const handleLogManualSession = () => {
    onAddStudySession(15);
    onTriggerToast("Simulated 15-minute focus logged!", "success");
    setTimeout(() => {
      onTriggerToast("+45 XP Earned!", "xp");
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="space-y-8"
    >
      <div className="border-b border-zinc-900/60 pb-6">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
          Performance Analytics
        </h1>
        <p className="text-xs text-zinc-500 font-semibold mt-0.5">
          Review your study hours, session streaks, and focus metrics in real-time.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-zinc-900 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan shrink-0">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Total Time</div>
            <div className="text-md font-black text-white">{totalMinutes}m</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-zinc-900 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
            <Award className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Total XP</div>
            <div className="text-md font-black text-white">{totalXP} XP</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-zinc-900 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald shrink-0">
            <CheckCircle className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Avg Session</div>
            <div className="text-md font-black text-white">{averageMinutes}m</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-zinc-900 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent-rose/10 border border-accent-rose/20 flex items-center justify-center text-accent-rose shrink-0">
            <Flame className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Study Streak</div>
            <div className="text-md font-black text-white">{currentStreak} Days</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* pomodoro timer widget */}
        <div className="glass-panel rounded-3xl p-6 border border-zinc-900/60 relative overflow-hidden flex flex-col justify-between h-[360px]">
          <div className="absolute inset-0 mesh-glow-purple opacity-20 pointer-events-none" />
          <div className="grain-overlay" />

          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent-purple" />
                Aetheria Focus Timer
              </div>
              <span
                className={cn(
                  "text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border",
                  timerMode === "focus"
                    ? "bg-accent-purple/10 border-accent-purple/20 text-accent-purple"
                    : "bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan"
                )}
              >
                {timerMode === "focus" ? "Focus Session" : "Rest Break"}
              </span>
            </div>

            <div className="mt-8 text-center">
              <div className="text-5xl font-black tracking-tighter text-white font-mono select-none">
                {formatTime(timeLeft)}
              </div>
              <p className="text-[10px] text-zinc-500 font-semibold mt-2">
                {isRunning
                  ? timerMode === "focus"
                    ? "Stay focused, you're doing great!"
                    : "Take a breath, rest your eyes."
                  : "Start the session to log real-time stats."}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-3 mt-6">
            <div className="flex gap-2">
              <button
                onClick={toggleTimer}
                className={cn(
                  "flex-1 py-3 rounded-xl font-black text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm",
                  isRunning
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                    : "bg-white text-black hover:bg-zinc-200"
                )}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5 fill-current" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" /> Start Focus
                  </>
                )}
              </button>
              <button
                onClick={resetTimer}
                className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              onClick={handleLogManualSession}
              className="w-full py-2.5 rounded-xl border border-zinc-900 bg-zinc-950/40 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white hover:border-zinc-800/80 transition-all duration-200 cursor-pointer"
            >
              Simulate 15m Focus Log
            </button>
          </div>
        </div>

        {/* bar chart trend graph */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-zinc-900/60 flex flex-col justify-between h-[360px]">
          <div className="grain-overlay" />
          <div className="absolute inset-0 mesh-glow-cyan opacity-20 pointer-events-none" />

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-accent-cyan" />
                Weekly Activity Tracker
              </div>
              <h2 className="text-md font-bold text-white mt-1">Study Duration Trend</h2>
            </div>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider border border-zinc-900 bg-zinc-950/40 px-2 py-0.5 rounded-lg">
              Last 7 Days
            </span>
          </div>

          <div className="relative z-10 flex-1 flex items-end justify-between gap-3 md:gap-6 pt-8 pb-4 h-48 w-full">
            {chartData.map((d, index) => {
              const percent = d.minutes > 0 ? (d.minutes / maxMinutesInChart) * 100 : 0;
              const barHeight = percent > 0 ? Math.max(percent, 8) : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute mb-24 bg-zinc-950 border border-zinc-800 text-[10px] text-white font-bold px-2 py-1 rounded shadow-lg pointer-events-none z-20">
                    {d.minutes} mins
                  </div>

                  <div className="w-full bg-zinc-950/50 rounded-xl overflow-hidden border border-zinc-900/80 h-full flex items-end">
                    <motion.div
                      className={cn(
                        "w-full rounded-t-xl transition-all duration-300",
                        d.minutes > 0
                          ? "bg-gradient-to-t from-accent-cyan to-cyan-400 shadow-md shadow-accent-cyan/15"
                          : "bg-zinc-900/40"
                      )}
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeight}%` }}
                      transition={{ type: "spring", stiffness: 80, damping: 15, delay: index * 0.05 }}
                    />
                  </div>

                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {d.dateLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-zinc-900/50 pt-4 flex justify-between items-center text-[10px] text-zinc-500 font-semibold">
            <span>Peak study: {maxMinutesInChart} mins/day</span>
            <span className="text-accent-cyan font-bold">{sessionCount} Focus sessions logged</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
