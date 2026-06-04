"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, CheckCircle2, Circle, Clock } from "lucide-react";
import { Course } from "@/types";
import { cn } from "@/lib/utils";
import DynamicIcon from "@/components/DynamicIcon";

interface CoursesTabProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export default function CoursesTab({ courses, onSelectCourse }: CoursesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "completed" && course.progress === 100) ||
      (filterStatus === "active" && course.progress < 100);
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900/60 pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            My Learning Syllabus
          </h1>
          <p className="text-xs text-zinc-500 font-semibold mt-0.5">
            Manage your courses, track your curriculum checkmarks, and unlock course milestones.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search syllabus..."
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-accent-cyan/50 focus:bg-zinc-950/80 transition-all duration-300 w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/40 border border-zinc-800/80 shrink-0 w-full sm:w-auto">
            {(["all", "active", "completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer",
                  filterStatus === status
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-zinc-900/60">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center mx-auto mb-4 text-zinc-500">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">
            No Syllabus Courses Found
          </h3>
          <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
            We couldn't find any courses matching your search query or status filter. Try resetting your settings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course, idx) => {
            const isCompleted = course.progress === 100;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                onClick={() => onSelectCourse(course)}
                className="group relative glass-panel rounded-3xl p-6 border border-zinc-900/50 hover:border-accent-purple/20 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-60"
              >
                <div className="absolute inset-0 mesh-glow-purple opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="grain-overlay" />

                <div className="relative z-10 flex justify-between items-start">
                  <div className="h-11 w-11 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-center text-accent-purple shrink-0 group-hover:bg-zinc-950/80 transition-colors">
                    <DynamicIcon name={course.icon_name} className="h-5 w-5" />
                  </div>

                  <span
                    className={cn(
                      "text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full border shadow-sm flex items-center gap-1.5",
                      isCompleted
                        ? "text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20"
                        : "text-accent-purple bg-accent-purple/10 border-accent-purple/20"
                    )}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="h-3 w-3" />
                        In Progress
                      </>
                    )}
                  </span>
                </div>

                <div className="relative z-10 mt-5 flex-1">
                  <h3 className="text-md font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 5 Lessons
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-800" />
                    <span className="text-[10px] text-zinc-500 font-semibold">
                      Created: {new Date(course.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mt-5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-zinc-500">Course Progress</span>
                    <span className="text-white font-bold">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-950/60 rounded-full overflow-hidden border border-zinc-900/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent-purple to-purple-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
