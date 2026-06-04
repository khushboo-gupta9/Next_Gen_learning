"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, CheckCircle2, Circle, Award, Play } from "lucide-react";
import { Course } from "@/types";
import { cn } from "@/lib/utils";

interface CourseDetailsModalProps {
  course: Course | null;
  onClose: () => void;
  onUpdateProgress: (courseId: string, newProgress: number) => void;
  onTriggerToast: (message: string, type: "success" | "info" | "xp") => void;
}

const LESSONS_DATABASE: Record<string, string[]> = {
  "c1b18d20-b492-4919-9407-28d575775f0a": [
    "Understanding Server Components (RSC)",
    "Next-Gen Hydration & Streaming Patterns",
    "Interactive Islands Architecture & React 19",
    "Advanced Suspense & Data Loading Boundaries",
    "Writing Secure Custom Server Actions"
  ],
  "c2b18d20-b492-4919-9407-28d575775f0b": [
    "Linear Regression & Gradient Descent Basics",
    "Multi-Layer Perceptrons & Backpropagation",
    "Mathematical foundations of Activation Functions",
    "Convolutional Neural Networks (CNNs) for Vision",
    "Transformers & Self-Attention Architectures"
  ],
  "c3b18d20-b492-4919-9407-28d575775f0c": [
    "Introduction to WebGL & Canvas Shaders",
    "GLSL Syntax, Uniforms & Fragment Shaders",
    "Custom Vertices & Model-View Matrices",
    "Noise Algorithms & Generative Shader Art",
    "Raymarching & Signed Distance Fields (SDFs)"
  ],
  "c4b18d20-b492-4919-9407-28d575775f0d": [
    "Core Principles of Motion in Modern UI UX",
    "Layout Orchestration with Framer Motion LayoutId",
    "Interactive Spring Gesture & Drag Physics",
    "WebGL/CSS shader transitions in web panels",
    "Dynamic HSL/RGB Theme Customization Engines"
  ]
};

const DEFAULT_LESSONS = [
  "Introduction & Core Concepts",
  "Environment Configuration & Tooling",
  "Implementation & Best Practices",
  "Optimization & Performance Profiling",
  "Deployment & Project Delivery"
];

export default function CourseDetailsModal({
  course,
  onClose,
  onUpdateProgress,
  onTriggerToast,
}: CourseDetailsModalProps) {
  const [completedLessons, setCompletedLessons] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    if (course) {
      const lessonsCount = 5;
      const progressPercent = course.progress;
      const completedCount = Math.round((progressPercent / 100) * lessonsCount);
      const initialChecked = Array(lessonsCount)
        .fill(false)
        .map((_, i) => i < completedCount);
      setCompletedLessons(initialChecked);
    }
  }, [course]);

  if (!course) return null;

  const lessons = LESSONS_DATABASE[course.id] || DEFAULT_LESSONS;

  const handleToggleLesson = (index: number) => {
    const nextCompleted = [...completedLessons];
    nextCompleted[index] = !nextCompleted[index];
    setCompletedLessons(nextCompleted);

    const completedCount = nextCompleted.filter(Boolean).length;
    const newProgress = completedCount * 20;

    onUpdateProgress(course.id, newProgress);

    if (nextCompleted[index]) {
      onTriggerToast(`Lesson Completed: ${lessons[index]}!`, "success");
      setTimeout(() => {
        onTriggerToast(`+60 XP Earned! Streak Active.`, "xp");
      }, 500);
    } else {
      onTriggerToast(`Lesson unmarked. Progress updated.`, "info");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden shadow-2xl relative border border-zinc-800/80 bg-zinc-950/70 z-10 flex flex-col"
        >
          <div className="grain-overlay" />
          <div className="absolute inset-0 mesh-glow-purple opacity-30 pointer-events-none" />

          <div className="flex items-start justify-between p-6 border-b border-zinc-900/60 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">
                  Course syllabus
                </h3>
                <h2 className="text-lg font-black text-white leading-snug mt-0.5 max-w-sm">
                  {course.title}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-6 relative z-10 overflow-y-auto max-h-[50vh]">
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-900 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-accent-purple" />
                  Your Course Progression
                </div>
                <div className="text-2xl font-black text-white">
                  {course.progress}% <span className="text-xs text-zinc-500 font-semibold">Done</span>
                </div>
              </div>

              {/* progress circle visual */}
              <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    className="stroke-zinc-800"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    className="stroke-accent-purple transition-all duration-500 ease-out"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={150.79}
                    strokeDashoffset={150.79 - (150.79 * course.progress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-[10px] font-black text-white">
                  {Math.round(course.progress / 20)}/5
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-accent-cyan" />
                Lessons List
              </h4>

              <div className="space-y-2">
                {lessons.map((lessonName, idx) => {
                  const isChecked = completedLessons[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleToggleLesson(idx)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-300",
                        isChecked
                          ? "bg-accent-cyan/5 border-accent-cyan/20 text-white"
                          : "bg-zinc-950/40 border-zinc-900/60 text-zinc-400 hover:border-zinc-800/80"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="h-4.5 w-4.5 text-accent-cyan fill-accent-cyan/10" />
                        ) : (
                          <Circle className="h-4.5 w-4.5 text-zinc-600 hover:text-zinc-400" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold leading-relaxed">{lessonName}</span>
                        <div className="text-[9px] text-zinc-500 font-semibold mt-0.5">
                          Lesson {idx + 1} • {isChecked ? "Completed" : "In Progress"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-zinc-900/60 bg-zinc-950/40 relative z-10 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:text-white hover:border-zinc-700 transition-colors duration-200"
            >
              Close Details
            </button>
            <button
              onClick={() => {
                onTriggerToast(`Launching lesson player for ${course.title}...`, "success");
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-white text-black font-black text-xs hover:bg-zinc-200 transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-white/5"
            >
              <Play className="h-3.5 w-3.5 fill-black stroke-[3]" />
              Start learning
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
