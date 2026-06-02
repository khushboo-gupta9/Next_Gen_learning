import React from "react";

export default function BentoSkeleton() {
  return (
    <div className="min-height-screen flex flex-col md:flex-row bg-background text-foreground relative z-10 w-full min-h-screen">
      {/* Sidebar Skeleton */}
      <aside className="w-full md:w-20 lg:w-64 glass-panel border-r border-zinc-900/50 flex flex-row md:flex-col justify-between p-4 shrink-0 h-16 md:h-screen">
        <div className="flex md:flex-col items-center md:items-start gap-4 md:w-full">
          {/* Logo Skeleton */}
          <div className="h-8 w-8 rounded-lg bg-zinc-800 animate-pulse shrink-0" />
          <div className="hidden lg:block h-5 w-24 rounded bg-zinc-800 animate-pulse" />
          {/* Nav Items Skeletons */}
          <div className="hidden md:flex flex-col gap-3 w-full mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-full rounded-xl bg-zinc-800/40 animate-pulse flex items-center p-3 gap-3">
                <div className="h-5 w-5 rounded bg-zinc-800 shrink-0" />
                <div className="hidden lg:block h-4 w-20 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Dashboard Skeleton */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Header Title Skeleton */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-9 w-64 rounded bg-zinc-800 animate-pulse mb-2" />
            <div className="h-4 w-40 rounded bg-zinc-800/60 animate-pulse" />
          </div>
        </header>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Hero Card Skeleton (Grid item: spans 2 cols on tablet/desktop) */}
          <article className="lg:col-span-2 glass-panel rounded-3xl p-6 relative overflow-hidden h-60 animate-pulse-slow">
            <div className="h-full flex flex-col justify-between relative z-10">
              <div>
                <div className="h-8 w-48 rounded bg-zinc-800 mb-3" />
                <div className="h-4 w-80 rounded bg-zinc-800/60 mb-2" />
                <div className="h-4 w-60 rounded bg-zinc-800/60" />
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-24 rounded-xl bg-zinc-800" />
                <div className="h-12 w-36 rounded-xl bg-zinc-800" />
              </div>
            </div>
            {/* Background Mesh Simulation */}
            <div className="absolute inset-0 bg-zinc-900/10 z-0 mesh-glow-purple" />
          </article>

          {/* Dynamic Course Card Skeletons */}
          {[1, 2, 3].map((i) => (
            <article key={i} className="glass-panel rounded-3xl p-6 h-60 flex flex-col justify-between relative overflow-hidden animate-pulse-slow">
              <div className="relative z-10 flex flex-col justify-between h-full w-full">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-800" />
                  <div className="h-5 w-12 rounded bg-zinc-800/60" />
                </div>
                <div className="mt-4">
                  <div className="h-6 w-3/4 rounded bg-zinc-800 mb-2" />
                  <div className="h-4 w-1/2 rounded bg-zinc-800/60" />
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full rounded bg-zinc-800 mb-2" />
                  <div className="h-4 w-10 rounded bg-zinc-800" />
                </div>
              </div>
            </article>
          ))}

          {/* Activity / Contribution Card Skeleton (Grid item: spans 2 cols on lg) */}
          <article className="lg:col-span-2 glass-panel rounded-3xl p-6 min-h-60 flex flex-col justify-between relative overflow-hidden animate-pulse-slow">
            <div className="relative z-10 h-full flex flex-col justify-between w-full">
              <div className="mb-4">
                <div className="h-6 w-40 rounded bg-zinc-800 mb-2" />
                <div className="h-4 w-64 rounded bg-zinc-800/60" />
              </div>
              {/* Contribution Grid Simulator */}
              <div className="grid grid-cols-7 gap-1.5 w-full py-4 overflow-x-auto">
                {Array.from({ length: 35 }).map((_, idx) => (
                  <div key={idx} className="aspect-square w-full rounded bg-zinc-800/40" />
                ))}
              </div>
              <div className="h-4 w-32 rounded bg-zinc-800/60 self-end mt-2" />
            </div>
          </article>

        </section>
      </main>
    </div>
  );
}
