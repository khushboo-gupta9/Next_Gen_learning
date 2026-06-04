# Aetheria: Next-Gen Student Learning Dashboard

Aetheria is a futuristic, highly animated, and responsive student learning dashboard prototype. It showcases a modern dark-mode Bento Grid design featuring staggered entrance animations, custom spring-based card interactions, collapsible navigation tabs, and study progress statistics.

The application leverages **Next.js (App Router)** for fast server rendering, **Supabase** for database integration, **Tailwind CSS v4** for clean utility styling, and **Framer Motion** for premium interactive animations.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js (App Router)
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS v4 (with native CSS-first configuration)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Helper Utilities**: `clsx`, `tailwind-merge`

---

## 🏗️ Architectural Choices & Features

This application implements a clean split between Server Components and Client Components to maximize load performance and interactivity:

### 1. Server Components (RSC)
- **`src/app/page.tsx`**: Home route acts as a Server Component. It fetches active course data directly from Supabase (using server-side secure calls) and serves it pre-rendered to client view boundaries.
- **`src/lib/supabase.ts`**: Handles credentials verification and server database queries. If credentials are missing or the database query fails, it logs a warning and returns pre-seeded local fallback courses. This allows instant previewing.

### 2. Client Components (`"use client"`)
- **`src/components/DashboardLayout.tsx`**: Organizes layout wrappers and manages current active tab routing, notifications, and top headers. Handles safe `releasePointerCapture` exceptions in React 19.
- **`src/components/Sidebar.tsx`**: Renders responsive navigation layouts. Controls active navigation animations using Framer Motion's `layoutId` matching selected states.
- **`src/components/HeroTile.tsx`**: Renders the welcome greeting, current active streak indicator, and XP progression.
- **`src/components/CourseCard.tsx`**: Renders individual course widgets, mapping dynamic icon components and rendering progress bar transitions.
- **`src/components/ActivityTile.tsx`**: Handles mouse hover coordinate tracking to position tooltips over daily heat-map grid cells and renders the weekly intensity chart.

### 3. Key Interactivity Features (Internship Polish)
- **Interactive Syllabus Checklists**: Students can open any course and check/uncheck individual lessons, dynamically updating course progress and earning XP.
- **Command K Search Palette**: Fully keyboard-accessible navigation menu (using arrow keys and Enter) for quick searching and jumping to pages or courses.
- **Pomodoro Focus Timer**: A modular timer allowing users to run study focus blocks (or rest breaks) which dynamically logs sessions and updates XP values.
- **Theme & Profile Persistence**: Settings are persisted to `localStorage` (safely handled on client-side mount) to retain username, study goal, and accent color selections across refreshes.
- **Dynamic Leaderboard**: The cohort ranking updates dynamically to reflect the user's customized name and live XP score.

---

## 🧠 Challenges Faced & Solutions

During development, I ran into a few interesting challenges and solved them as follows:

1. **Framer Motion & React 19 Pointer Capture Bug**:
   React 19 has some issues with Framer Motion where pointer capture release triggers `releasePointerCapture` errors on unmounted or inactive pointer IDs. To fix this and prevent runtime crashes, I wrote a safe global polyfill inside `DashboardLayout.tsx` that wraps the native method in a `try-catch` block.
   
2. **Next.js Hydration Mismatches**:
   When implementing the live date/time display and loading user preferences (like theme and username) from `localStorage`, I got hydration mismatch warnings because the server and client HTML rendered different initial values. I resolved this by only updating these states inside a `useEffect` hook after the component mounted on the client.

3. **Strict TypeScript Types for Framer Motion**:
   TypeScript kept complaining about the custom transition configurations (like `type: "spring"`) when declaring variants in separate object variables, since it inferred them as general strings. I resolved this by using `as const` type assertion (e.g. `type: "spring" as const`) to narrow the literal type.

4. **Layout & Independent Scrolling**:
   Ensuring the sidebar remains fixed on desktop while the bento grid is scrollable was tricky without causing layout shifts. I handled this by applying a rigid `h-screen overflow-hidden` wrapper on the main layout and set `overflow-y-auto` only on the main dashboard container.

---

## 🗄️ Database Setup (Supabase)

To link this application to your live Supabase database, run the following SQL commands in your **Supabase SQL Editor**:

```sql
-- 1. Create the courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
    icon_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 3. Create a public read-only policy
CREATE POLICY "Allow public read access" 
ON public.courses 
FOR SELECT 
TO public 
USING (true);

-- 4. Seed the database with sample courses
INSERT INTO public.courses (title, progress, icon_name)
VALUES 
  ('Advanced React & Next.js Patterns', 78, 'Code'),
  ('Neural Networks & Deep Learning', 42, 'Brain'),
  ('Creative Coding & WebGL Shader Design', 92, 'Sparkles'),
  ('Futuristic UI Systems & Motion Design', 65, 'Tv');
```

After seeding, configure your `.env.local` credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-api-key
```

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Run standard build compiler checks:
   ```bash
   npm run build
   ```
