"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Sliders, BarChart2, LayoutDashboard, CornerDownLeft, Zap } from "lucide-react";
import { Course } from "@/types";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectTab: (tabId: string) => void;
  onSelectCourse: (course: Course) => void;
}

const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "courses", label: "My Courses", icon: "BookOpen" },
  { id: "analytics", label: "Analytics", icon: "BarChart2" },
  { id: "settings", label: "Settings", icon: "Sliders" },
];

export default function SearchModal({
  isOpen,
  onClose,
  courses,
  onSelectTab,
  onSelectCourse,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearchQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filteredTabs = NAVIGATION_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const results = [
    ...filteredTabs.map((t) => ({ type: "tab" as const, id: t.id, label: t.label, icon: t.icon })),
    ...filteredCourses.map((c) => ({ type: "course" as const, id: c.id, label: c.title, icon: c.icon_name, progress: c.progress, course: c })),
  ];

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, activeIndex]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector("[data-active='true']");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const handleSelect = (item: typeof results[0]) => {
    if (item.type === "tab") {
      onSelectTab(item.id);
    } else {
      onSelectCourse(item.course);
    }
    onClose();
  };

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "LayoutDashboard":
        return <LayoutDashboard className={className} />;
      case "BookOpen":
      case "Code":
        return <BookOpen className={className} />;
      case "BarChart2":
      case "Brain":
        return <BarChart2 className={className} />;
      case "Sliders":
      case "Zap":
      case "Tv":
        return <Sliders className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="w-full max-w-xl glass-panel rounded-3xl overflow-hidden shadow-2xl relative border border-zinc-800/80 bg-zinc-950/65 flex flex-col max-h-[60vh] z-10"
          >
            <div className="grain-overlay" />
            <div className="absolute inset-0 mesh-glow-purple opacity-30 pointer-events-none" />

            <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-900/60 bg-zinc-950/40 relative z-10">
              <Search className="h-5 w-5 text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, pages, or sections..."
                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-zinc-500 font-medium"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                  ESC
                </span>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-3 relative z-10 space-y-4"
            >
              {results.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs font-semibold">
                  No matches found. Try searching for "React", "Deep Learning", or "Settings".
                </div>
              ) : (
                <>
                  {filteredTabs.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-3 mb-2">
                        Navigation Pages
                      </div>
                      <div className="space-y-1">
                        {results
                          .map((item, idx) => ({ item, idx }))
                          .filter(({ item }) => item.type === "tab")
                          .map(({ item, idx }) => {
                            const isActive = idx === activeIndex;
                            return (
                              <button
                                key={item.id}
                                data-active={isActive}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors duration-150 border",
                                  isActive
                                    ? "bg-accent-purple/10 border-accent-purple/30 text-white"
                                    : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/30"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  {renderIcon(item.icon, cn("h-4 w-4 shrink-0", isActive ? "text-accent-purple" : "text-zinc-500"))}
                                  <span className="text-xs font-bold">{item.label}</span>
                                </div>
                                {isActive && (
                                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-accent-purple uppercase tracking-wider shrink-0 bg-accent-purple/10 px-1.5 py-0.5 rounded">
                                    Select <CornerDownLeft className="h-2.5 w-2.5" />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {filteredCourses.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-3 mb-2">
                        My Courses
                      </div>
                      <div className="space-y-1">
                        {results
                          .map((item, idx) => ({ item, idx }))
                          .filter(({ item }) => item.type === "course")
                          .map(({ item, idx }) => {
                            const isActive = idx === activeIndex;
                            return (
                              <button
                                key={item.id}
                                data-active={isActive}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors duration-150 border",
                                  isActive
                                    ? "bg-accent-cyan/10 border-accent-cyan/30 text-white"
                                    : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/30"
                                )}
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  {renderIcon(item.icon, cn("h-4 w-4 shrink-0", isActive ? "text-accent-cyan" : "text-zinc-500"))}
                                  <div className="overflow-hidden">
                                    <div className="text-xs font-bold truncate">{item.label}</div>
                                    <div className="text-[9px] text-zinc-500 font-semibold mt-0.5">
                                      Progress: {item.type === "course" ? item.progress : 0}% Completed
                                    </div>
                                  </div>
                                </div>
                                {isActive ? (
                                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-accent-cyan uppercase tracking-wider shrink-0 bg-accent-cyan/10 px-1.5 py-0.5 rounded">
                                    Resume <CornerDownLeft className="h-2.5 w-2.5" />
                                  </span>
                                ) : (
                                  <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden shrink-0">
                                    <div
                                      className="h-full bg-zinc-600 rounded-full"
                                      style={{ width: `${item.type === "course" ? item.progress : 0}%` }}
                                    />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="px-4 py-2 bg-zinc-950/80 border-t border-zinc-900/50 flex justify-between items-center text-[9px] text-zinc-600 font-bold uppercase tracking-wider relative z-10 shrink-0">
              <span>↑↓ Navigation</span>
              <span>Enter Select</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
