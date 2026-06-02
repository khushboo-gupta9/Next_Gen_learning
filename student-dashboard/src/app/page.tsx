import React from "react";
import { fetchCourses } from "@/lib/supabase";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Opt-out of static rendering to ensure data fetching is fresh and runs server-side on every request
export const revalidate = 0;

export default async function Home() {
  // Fetch courses from Supabase using Server Components (RSC)
  const { data: courses, isFallback, error: dbError } = await fetchCourses();

  return (
    <DashboardLayout 
      courses={courses} 
      isFallback={isFallback} 
      dbError={dbError} 
    />
  );
}
