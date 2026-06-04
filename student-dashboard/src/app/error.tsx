"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, Terminal } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Red Neon Grid Glow Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(244, 63, 94, 0.08) 0%, transparent 60%)" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(244,63,94,0.15)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full glass-panel rounded-3xl p-8 border border-accent-rose/20 shadow-2xl shadow-accent-rose/5 overflow-hidden">
        {/* Top glow border */}
        <div className="absolute inset-0 border border-zinc-800/80 rounded-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent-rose via-rose-500 to-accent-rose" />
        
        {/* Grain overlay texture */}
        <div className="grain-overlay" style={{ opacity: 0.03 }} />

        {/* Warning Icon Banner */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <span className="absolute -inset-2 rounded-full bg-accent-rose/20 blur-md animate-pulse" />
            <div className="relative h-16 w-16 rounded-2xl bg-accent-rose/15 border border-accent-rose/30 flex items-center justify-center text-accent-rose">
              <AlertTriangle className="h-8 w-8 animate-bounce" style={{ animationDuration: "2.5s" }} />
            </div>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent-rose" />
            Terminal Exception
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Error Code: {error.digest || "SYS-ERR-0x38B"}
          </p>

          <p className="text-sm text-zinc-400 mt-4 max-w-sm leading-relaxed font-medium">
            The Aetheria core runtime encountered an unexpected compilation or loading issue. 
          </p>

          {/* Fault Log Panel */}
          <div className="w-full bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 mt-6 text-left font-mono text-[11px] text-zinc-400 overflow-x-auto shadow-inner relative">
            <div className="flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase tracking-wider mb-2 border-b border-zinc-900/60 pb-1.5">
              <span>Stack log:</span>
              <span className="text-accent-rose">CRITICAL</span>
            </div>
            <p className="font-bold text-accent-rose/85 truncate">
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <p className="mt-2 text-zinc-600 leading-normal line-clamp-3 overflow-hidden text-ellipsis select-all">
                {error.stack}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-8">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-black text-xs hover:bg-zinc-200 transition-colors duration-200 shadow-md shadow-white/5 w-full cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "3s" }} />
              Reset Aetheria Terminal
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-300 font-black text-xs hover:text-white hover:border-zinc-700 transition-colors duration-200 w-full cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              Return to Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
