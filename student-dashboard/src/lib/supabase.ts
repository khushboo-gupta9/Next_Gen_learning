import { createClient } from "@supabase/supabase-js";
import { Course } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Course Mock Data
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
    icon_name: "Zap",
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

export interface StudySession {
  id: string;
  session_date: string;
  minutes_studied: number;
  xp_earned: number;
  created_at: string;
}

// Generate 105 days (15 weeks) of high-fidelity study analytics data
export function generateMockStudySessions(): StudySession[] {
  const sessions: StudySession[] = [];
  const now = new Date();
  for (let i = 104; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    // Format date as YYYY-MM-DD
    const dateString = date.toISOString().split("T")[0];
    
    // Create custom wave pattern for study minutes
    const seedVal = (i % 3 === 0 ? 1 : 0) + (i % 7 === 0 ? 2 : 0) + (i % 11 === 0 ? 1 : 0);
    const level = Math.min(seedVal, 4);
    
    // Minutes studied: level 0 = 0, level 1 = 20-34, level 2 = 40-54, etc.
    const minutes = level === 0 ? 0 : level * 20 + (i % 15);
    const xp = minutes * 3; // 3 XP per minute

    sessions.push({
      id: `session-mock-${i}`,
      session_date: dateString,
      minutes_studied: minutes,
      xp_earned: xp,
      created_at: date.toISOString(),
    });
  }
  return sessions;
}

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

/**
 * Fetches study sessions list for analytics.
 * Automatically falls back to high-fidelity mock data if Supabase keys are missing or query fails.
 */
export async function fetchStudyAnalytics(): Promise<{ data: StudySession[]; isFallback: boolean; error: string | null }> {
  if (!supabase) {
    console.warn("Supabase keys are missing. Running study analytics in local fallback mode.");
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { data: generateMockStudySessions(), isFallback: true, error: null };
  }

  try {
    const { data, error } = await supabase
      .from("study_analytics")
      .select("*")
      .order("session_date", { ascending: true });

    if (error) {
      console.error("Database query failed for study analytics, falling back to mock data. Error details:", error.message);
      return { data: generateMockStudySessions(), isFallback: true, error: error.message };
    }

    if (!data || data.length === 0) {
      console.info("Database queried successfully for study analytics but returned empty table. Using mock seed data.");
      return { data: generateMockStudySessions(), isFallback: true, error: null };
    }

    return { data: data as StudySession[], isFallback: false, error: null };
  } catch (err: any) {
    console.error("An unexpected error occurred during database fetch for study analytics:", err);
    return { data: generateMockStudySessions(), isFallback: true, error: err?.message || "Unexpected error occurred" };
  }
}
