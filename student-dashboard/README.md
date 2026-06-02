# Aetheria: Next-Gen Student Learning Dashboard

Aetheria is a futuristic, highly animated, and responsive student learning dashboard prototype. It showcases a modern dark-mode Bento Grid design featuring staggered entrance animations, custom spring-based card interactions, collapsible navigation tabs, and study progress statistics.

The application leverages **Next.js (App Router)** for fast server rendering, **Supabase** for database integration, **Tailwind CSS v4** for clean utility styling, and **Framer Motion** for premium interactive animations.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 15+ (App Router)
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS v4 (with native CSS-first configuration)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Helper Utilities**: `clsx`, `tailwind-merge`

---

## 🏗️ Architectural Choices & Split

This application implements a clean split between Server Components and Client Components to maximize load performance and interactivity:

### 1. Server Components (RSC)
- **`src/app/page.tsx`**: Home route acts as a Server Component. It fetches active course data directly from Supabase (using server-side secure calls) and serves it pre-rendered to client view boundaries.
- **`src/lib/supabase.ts`**: Handles credentials verification and server database queries. If credentials are missing or the database query fails, it logs a warning and returns pre-seeded local fallback courses. This allows instant previewing.

### 2. Client Components (`"use client"`)
- **`src/components/dashboard/DashboardLayout.tsx`**: Organizes layout wrappers and manages current active tab routing, notifications, and top headers.
- **`src/components/dashboard/Sidebar.tsx`**: Renders responsive navigation layouts. Controls active navigation animations using Framer Motion's `layoutId` layout animation matching selected states.
- **`src/components/dashboard/HeroCard.tsx`**: Renders the welcome greeting, current active streak indicator, and XP progression.
- **`src/components/dashboard/CourseCard.tsx`**: Renders individual course widgets, mapping dynamic icon components and rendering custom-mounted progress bar transitions (animating from `0%` to target).
- **`src/components/dashboard/ActivityCard.tsx`**: Handles mouse hover coordinate tracking to position tooltips over daily heat-map grid cells showing study duration.

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
