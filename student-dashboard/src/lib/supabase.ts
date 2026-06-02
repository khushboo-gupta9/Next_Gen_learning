import { createClient } from "@supabase/supabase-js";
import { Course } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Human-like mock seed data in case Supabase is not configured
export const MOCK_COURSES: Course[] = [
  {
    id: "c1b18d20-b492-4919-9407-28d575775f0a",
    title: "Advanced React & Next.js Patterns",
    progress: 78,
    icon_name: "Code",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  },
  {
    id: "c2b18d20-b492-4919-9407-28d575775f0b",
    title: "Neural Networks & Deep Learning",
    progress: 42,
    icon_name: "Brain",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
  },
  {
    id: "c3b18d20-b492-4919-9407-28d575775f0c",
    title: "Creative Coding & WebGL Shader Design",
    progress: 92,
    icon_name: "Sparkles",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: "c4b18d20-b492-4919-9407-28d575775f0d",
    title: "Futuristic UI Systems & Motion Design",
    progress: 65,
    icon_name: "Tv",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(), // 21 days ago
  },
];

// Initialize Supabase Client conditional on env variables
export const supabase = 
  supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

/**
 * Fetches course list.
 * Automatically falls back to high-fidelity mock data if Supabase keys are missing or query fails.
 */
export async function fetchCourses(): Promise<{ data: Course[]; isFallback: boolean; error: string | null }> {
  if (!supabase) {
    console.warn("Supabase keys are missing. Running in local fallback mode with mock data.");
    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { data: MOCK_COURSES, isFallback: true, error: null };
  }

  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database query failed, falling back to mock data. Error details:", error.message);
      return { data: MOCK_COURSES, isFallback: true, error: error.message };
    }

    if (!data || data.length === 0) {
      console.info("Database queried successfully but returned empty courses table. Using mock seed data.");
      return { data: MOCK_COURSES, isFallback: true, error: null };
    }

    return { data: data as Course[], isFallback: false, error: null };
  } catch (err: any) {
    console.error("An unexpected error occurred during database fetch:", err);
    return { data: MOCK_COURSES, isFallback: true, error: err?.message || "Unexpected error occurred" };
  }
}
