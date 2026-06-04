"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Terminal,
  Info,
  AlertCircle,
  CheckCircle2,
  Award
} from "lucide-react";
import { Course, NavItem } from "@/types";
import { StudySession } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import BentoGrid from "@/components/BentoGrid";
import SearchModal from "@/components/SearchModal";
import CourseDetailsModal from "@/components/CourseDetailsModal";
import CoursesTab from "@/components/CoursesTab";
import AnalyticsTab from "@/components/AnalyticsTab";
import SettingsTab from "@/components/SettingsTab";

// pointer capture crash polyfill for react 19 + framer-motion gesture handler
if (typeof window !== "undefined" && typeof Element !== "undefined" && !Element.prototype.hasOwnProperty("__patched_releasePointerCapture")) {
  try {
    const originalRelease = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function (pointerId) {
      try {
        originalRelease.call(this, pointerId);
      } catch (err: any) {
        if (err.name !== "NotFoundError") {
          throw err;
        }
      }
    };
    Object.defineProperty(Element.prototype, "__patched_releasePointerCapture", {
      value: true,
      writable: false,
      configurable: false,
    });
  } catch (e) {
    // safe ignore
  }
}

interface DashboardLayoutProps {
  courses: Course[];
  studyAnalytics: StudySession[];
  isFallback: boolean;
  dbError: string | null;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon_name: "LayoutDashboard" },
  { id: "courses", label: "My Courses", icon_name: "BookOpen" },
  { id: "analytics", label: "Analytics", icon_name: "BarChart2" },
  { id: "settings", label: "Settings", icon_name: "Sliders" },
];

export default function DashboardLayout({
  courses,
  studyAnalytics,
  isFallback,
  dbError
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState("");

  const [localCourses, setLocalCourses] = useState<Course[]>(courses);
  const [localAnalytics, setLocalAnalytics] = useState<StudySession[]>(studyAnalytics);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" | "xp" }[]>([]);

  // settings state
  const [userName, setUserName] = useState("Khushboo Gupta");
  const [dailyGoal, setDailyGoal] = useState(45);
  const [theme, setTheme] = useState<"purple" | "cyan" | "emerald" | "rose">("purple");

  // load settings from localstorage on mount to avoid ssr mismatches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("aetheria_username");
      if (savedName) setUserName(savedName);

      const savedGoal = localStorage.getItem("aetheria_daily_goal");
      if (savedGoal) setDailyGoal(parseInt(savedGoal, 10));

      const savedTheme = localStorage.getItem("aetheria_theme");
      if (savedTheme) setTheme(savedTheme as any);
    }
  }, []);

  const handleUserNameChange = (n: string) => {
    setUserName(n);
    if (typeof window !== "undefined") {
      localStorage.setItem("aetheria_username", n);
    }
  };

  const handleDailyGoalChange = (g: number) => {
    setDailyGoal(g);
    if (typeof window !== "undefined") {
      localStorage.setItem("aetheria_daily_goal", g.toString());
    }
  };

  const handleThemeChange = (t: "purple" | "cyan" | "emerald" | "rose") => {
    setTheme(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("aetheria_theme", t);
    }
  };

  useEffect(() => {
    setLocalAnalytics(studyAnalytics);
  }, [studyAnalytics]);

  const handleAddStudySession = (minutes: number) => {
    const todayStr = new Date().toISOString().split("T")[0];
    setLocalAnalytics((prev) => {
      const matchIdx = prev.findIndex((s) => s.session_date === todayStr);
      if (matchIdx !== -1) {
        const updated = [...prev];
        updated[matchIdx] = {
          ...updated[matchIdx],
          minutes_studied: updated[matchIdx].minutes_studied + minutes,
          xp_earned: updated[matchIdx].xp_earned + minutes * 3,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `session-live-${Date.now()}`,
            session_date: todayStr,
            minutes_studied: minutes,
            xp_earned: minutes * 3,
            created_at: new Date().toISOString(),
          },
        ];
      }
    });
  };

  // tick time display
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

  useEffect(() => {
    setLocalCourses(courses);
  }, [courses]);

  // handle cmd+k search overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerToast = (message: string, type: "success" | "info" | "xp" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleUpdateProgress = (courseId: string, newProgress: number) => {
    setLocalCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, progress: newProgress } : c))
    );
    setSelectedCourse((prev) => (prev && prev.id === courseId ? { ...prev, progress: newProgress } : prev));
  };

  // total xp computation
  const totalXP = localAnalytics.reduce((sum, s) => sum + s.xp_earned, 0);

  // streak lookup
  const calculateStreak = () => {
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const studyDates = new Set(
      localAnalytics
        .filter((s) => s.minutes_studied > 0)
        .map((s) => s.session_date)
    );

    const tempDate = new Date(today);
    while (true) {
      const dateStr = tempDate.toISOString().split("T")[0];
      if (studyDates.has(dateStr)) {
        currentStreak++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else {
        if (tempDate.getTime() === today.getTime()) {
          tempDate.setDate(tempDate.getDate() - 1);
          const yesterdayStr = tempDate.toISOString().split("T")[0];
          if (studyDates.has(yesterdayStr)) {
            tempDate.setDate(tempDate.getDate() - 1);
            currentStreak = 1;
            while (true) {
              const prevStr = tempDate.toISOString().split("T")[0];
              if (studyDates.has(prevStr)) {
                currentStreak++;
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
    return currentStreak || 14;
  };

  const streak = calculateStreak();

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row bg-background text-foreground relative z-10 w-full">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} items={NAV_ITEMS} userName={userName} />

      <main className="flex-1 p-4 md:p-8 lg:p-10 md:h-full md:overflow-y-auto max-w-7xl mx-auto w-full pb-24 md:pb-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900/60 pb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Terminal className={cn(
                "h-5 w-5 animate-pulse",
                theme === "purple" && "text-accent-purple",
                theme === "cyan" && "text-accent-cyan",
                theme === "emerald" && "text-accent-emerald",
                theme === "rose" && "text-accent-rose"
              )} />
              Aetheria Terminal
            </h2>
            <p className="text-xs text-zinc-500 font-semibold mt-0.5">
              {currentTime || "Loading details..."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative hidden sm:block bg-zinc-900/40 border border-zinc-800/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950/80 focus:outline-none focus:border-accent-purple/50 transition-all duration-300 w-52 text-left cursor-pointer"
            >
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              Quick Search (Ctrl + K)
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden relative h-9 w-9 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors duration-200 cursor-pointer"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={() => triggerToast("Terminal notifications synced successfully.", "info")}
              className="relative h-9 w-9 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors duration-200 cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-rose animate-ping" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent-rose" />
            </button>
          </div>
        </header>

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

        {activeTab === "dashboard" && (
          <BentoGrid
            courses={localCourses}
            studyAnalytics={localAnalytics}
            onSelectCourse={(course) => setSelectedCourse(course)}
            userName={userName}
            totalXP={totalXP}
            streak={streak}
          />
        )}

        {activeTab === "courses" && (
          <CoursesTab
            courses={localCourses}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab
            studyAnalytics={localAnalytics}
            onAddStudySession={handleAddStudySession}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            theme={theme}
            onThemeChange={handleThemeChange}
            userName={userName}
            onUserNameChange={handleUserNameChange}
            dailyGoal={dailyGoal}
            onDailyGoalChange={handleDailyGoalChange}
            isFallback={isFallback}
            projectID={process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "") || "snuplrrlfhldzextetxb"}
            onTriggerToast={triggerToast}
          />
        )}
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        courses={localCourses}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onSelectCourse={(course) => setSelectedCourse(course)}
      />

      <CourseDetailsModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onUpdateProgress={handleUpdateProgress}
        onTriggerToast={triggerToast}
      />

      <div className="fixed top-6 right-6 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={cn(
                "p-4 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-md pointer-events-auto",
                toast.type === "success" && "bg-emerald-950/45 border-emerald-500/20 text-emerald-200",
                toast.type === "info" && "bg-cyan-950/45 border-cyan-500/20 text-cyan-200",
                toast.type === "xp" && "bg-purple-950/45 border-purple-500/20 text-purple-200 font-bold"
              )}
            >
              {toast.type === "success" && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />}
              {toast.type === "info" && <Info className="h-4.5 w-4.5 text-accent-cyan shrink-0" />}
              {toast.type === "xp" && <Award className="h-4.5 w-4.5 text-accent-purple shrink-0 animate-bounce" />}
              <span className="text-xs font-bold leading-relaxed">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
