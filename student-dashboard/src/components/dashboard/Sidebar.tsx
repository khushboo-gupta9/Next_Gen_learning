"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { NavItem } from "@/types";
import { cn } from "@/lib/utils";

// Helper utility (Next.js create-next-app generates a similar utility or we can write a simple one)
// Let's implement CN inside the component or a helper file. Let's make a simple local helper to ensure zero import issues.

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  items: NavItem[];
}

export default function Sidebar({ activeTab, setActiveTab, items }: SidebarProps) {
  return (
    <>
      {/* Desktop / Tablet Sidebar (Left) */}
      <aside className="hidden md:flex flex-col justify-between p-4 glass-panel border-r border-zinc-900/50 shrink-0 h-screen transition-all duration-300 md:w-20 lg:w-64">
        <div className="flex flex-col gap-6 items-center lg:items-start w-full">
          {/* Logo / Header */}
          <div className="flex items-center gap-3 px-3 py-2 w-full justify-center lg:justify-start">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-purple/20 shrink-0">
              <Icons.GraduationCap className="h-6 w-6 text-black stroke-[2.5]" />
            </div>
            <span className="hidden lg:block font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              AETHERIA
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 w-full mt-4" aria-label="Main Navigation">
            {items.map((item) => {
              // Resolve Lucide icon component dynamically
              const IconComponent = (Icons as any)[item.icon_name] || Icons.HelpCircle;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-semibold transition-colors duration-200 outline-none w-full justify-center lg:justify-start group",
                    isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Sliding Active Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-zinc-900 rounded-xl border border-zinc-800/80 -z-10 shadow-inner"
                      transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  <IconComponent className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-105 shrink-0",
                    isActive ? "text-accent-cyan" : "text-zinc-500 group-hover:text-zinc-400"
                  )} />
                  <span className="hidden lg:block tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Card Footer */}
        <div className="flex items-center gap-3 p-2 rounded-xl border border-zinc-900/40 bg-zinc-950/20 lg:w-full justify-center lg:justify-start">
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-accent-purple to-accent-rose flex items-center justify-center text-sm font-bold text-white shadow-md">
              KS
            </div>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h4 className="text-xs font-bold text-zinc-200 truncate">Khush Singh</h4>
            <p className="text-[10px] text-zinc-500 font-medium truncate">Premium Student</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-zinc-900/50 flex items-center justify-around px-4 pb-safe z-50 shadow-2xl"
        aria-label="Mobile Navigation"
      >
        {items.map((item) => {
          const IconComponent = (Icons as any)[item.icon_name] || Icons.HelpCircle;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-4 rounded-xl text-[10px] font-semibold transition-colors duration-200 outline-none",
                isActive ? "text-white" : "text-zinc-500"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicatorMobile"
                  className="absolute inset-x-0 top-0 bottom-0 bg-zinc-900/80 rounded-xl border border-zinc-800/40 -z-10"
                  transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                />
              )}
              <IconComponent className={cn(
                "h-5 w-5 mb-0.5 transition-transform duration-200",
                isActive ? "text-accent-cyan" : "text-zinc-500"
              )} />
              <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
