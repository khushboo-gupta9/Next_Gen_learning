"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bell, 
  Search, 
  Sparkles, 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  AlertCircle,
  HelpCircle,
  LogOut,
  Sliders,
  BarChart2,
  LayoutDashboard
} from "lucide-react";
import { Course, NavItem } from "@/types";
import Sidebar from "./Sidebar";
import HeroCard from "./HeroCard";
import CourseCard from "./CourseCard";
import ActivityCard from "./ActivityCard";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  courses: Course[];
  isFallback: boolean;
  dbError: string | null;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon_name: "LayoutDashboard" },
  { id: "courses", label: "My Courses", icon_name: "BookOpen" },
  { id: "analytics", label: "Analytics", icon_name: "BarChart2" },
  { id: "settings", label: "Settings", icon_name: "Sliders" },
];

export default function DashboardLayout({ courses, isFallback, dbError }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState("");

  // Update clock on mount (prevents SSR hydration mismatch)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        }) + " • " + now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Framer Motion container variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground relative z-10 w-full">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} items={NAV_ITEMS} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full pb-24 md:pb-8">
        
        {/* Top Header Section */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900/60 pb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent-purple animate-pulse" />
              Aetheria Terminal
            </h2>
            <p className="text-xs text-zinc-500 font-semibold mt-0.5">
              {currentTime || "Loading dashboard details..."}
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Quick Search (Ctrl + K)" 
                className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-accent-purple/50 focus:bg-zinc-950/80 transition-all duration-300 w-52"
                readOnly
              />
            </div>
            
            {/* Notification Badge */}
            <button className="relative h-9 w-9 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors duration-200">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-rose animate-ping" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-rose" />
            </button>
          </div>
        </header>

        {/* Database Status Alert (Rendered if in fallback mode or error occurred) */}
        {isFallback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-amber-200 flex items-start gap-3 backdrop-blur-md"
          >
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs font-medium">
              <span className="font-bold">Fallback Preview Mode:</span> {dbError ? `Database error: "${dbError}".` : "Could not find Supabase environment variables."} Local seed data is loaded instead. Set up your <code className="bg-amber-950/60 px-1 py-0.5 rounded text-amber-300">.env.local</code> credentials to query a live Supabase server.
            </div>
          </motion.div>
        )}

        {/* Main Tabs switcher */}
        {activeTab === "dashboard" ? (
          /* Staggered Bento Grid Layout */
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Hero Greeting & Streak Card (Grid: spans 2 cols on tablet/desktop) */}
            <HeroCard />

            {/* Course Card 1 (First element in the grid columns) */}
            {courses[0] && <CourseCard course={courses[0]} index={0} />}

            {/* Course Card 2 */}
            {courses[1] && <CourseCard course={courses[1]} index={1} />}
            
            {/* Course Card 3 */}
            {courses[2] && <CourseCard course={courses[2]} index={2} />}

            {/* Course Card 4 */}
            {courses[3] && <CourseCard course={courses[3]} index={3} />}

            {/* Contribution/Activity Chart (Grid: spans 2 cols on tablet/desktop) */}
            <ActivityCard />

            {/* Premium Gamified Leaderboard Card (Grid: 1 col, finishes row beautifully) */}
            <motion.article
              variants={itemVariants}
              className="group relative glass-panel rounded-3xl p-6 flex flex-col justify-between overflow-hidden h-72 md:h-64 cursor-pointer"
              whileHover={{
                scale: 1.02,
                transition: { type: "spring" as const, stiffness: 300, damping: 20 },
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

                {/* Leaderboard list */}
                <div className="space-y-3 my-3">
                  {[
                    { rank: 1, name: "Aarav Sharma", xp: 1420, active: true },
                    { rank: 2, name: "Khush Singh", xp: 940, active: false, self: true },
                    { rank: 3, name: "Ananya Iyer", xp: 890, active: false },
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
                          {user.name} {user.self && "(You)"}
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
        ) : (
          /* Placeholder screens for other sidebar tabs */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
            className="glass-panel rounded-3xl p-12 min-h-96 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 mesh-glow-purple opacity-40 pointer-events-none" />
            <div className="grain-overlay" />
            
            <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center mb-6 relative z-10">
              {activeTab === "courses" && <BookOpen className="h-8 w-8 text-accent-cyan" />}
              {activeTab === "analytics" && <BarChart2 className="h-8 w-8 text-accent-emerald" />}
              {activeTab === "settings" && <Sliders className="h-8 w-8 text-accent-purple" />}
            </div>
            
            <h2 className="text-xl font-black text-white mb-2 relative z-10 uppercase tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
            </h2>
            <p className="text-sm text-zinc-400 max-w-sm mb-6 font-medium relative z-10 leading-relaxed">
              This panel is a mock destination. The core task focuses on the fully dynamic, animated Aetheria Student Dashboard.
            </p>
            
            <button 
              onClick={() => setActiveTab("dashboard")} 
              className="relative z-10 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-colors duration-200 shadow-md shadow-white/5"
            >
              Return to Dashboard
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
