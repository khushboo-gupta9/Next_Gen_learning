import React from "react";
import { fetchCourses, fetchStudyAnalytics } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";

// Opt-out of static rendering to ensure data fetching is fresh and runs server-side on every request
export const revalidate = 0;

export default async function Home() {
  // Fetch both courses and study sessions in parallel on the server
  const [coursesRes, analyticsRes] = await Promise.all([
    fetchCourses(),
    fetchStudyAnalytics(),
  ]);

  return (
    <DashboardLayout 
      courses={coursesRes.data} 
      studyAnalytics={analyticsRes.data}
      isFallback={coursesRes.isFallback || analyticsRes.isFallback} 
      dbError={coursesRes.error || analyticsRes.error} 
    />
  );
}
