import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { mapColorToBg } from "@/lib/color-to-bg";
import Footer from "@/components/footer";
import { useAssignments } from "@/hooks/use-assignments";
import { DayList } from "@/components/days/day-list";
import type { DayItem } from "@/components/days/day";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: assignments, isLoading, error } = useAssignments();

    // Check if user has any courses
    const { data: userCourses } = useQuery({
        queryKey: ["user-courses-check", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("user_courses")
                .select("course_id")
                .eq("user_id", user.id);
            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
    });

    // Redirect to course selection if user has no courses
    useEffect(() => {
        if (user && userCourses !== undefined && userCourses.length === 0) {
            navigate({ to: "/new-course" });
        }
    }, [user, userCourses, navigate]);
    // Convert assignments to DayItem format

    const assignmentItems: DayItem[] =
        assignments?.map((assignment) => {
            // Format the date to YYYY-MM-DD for the day-list component
            let formattedDate = new Date().toISOString().split("T")[0];
            if (assignment.due_date) {
                const date = new Date(assignment.due_date);
                formattedDate = date.toISOString().split("T")[0];
            }

            return {
                id: assignment.assignment_id,
                title: assignment.title || "Untitled Assignment",
                date: formattedDate,
                color: mapColorToBg(assignment.course.color),
                description: `Course: ${assignment.course.title || "Untitled Course"}`,
                url: undefined, // URL would come from a different API endpoint if needed
            };
        }) || [];

    // Show loading while checking courses or loading assignments
    if (isLoading || userCourses === undefined) {
        return (
            <div className="flex flex-col h-screen items-center justify-center">
                <div>Loading assignments...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen items-center justify-center">
                <div>Error loading assignments</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen items-center font-asul">
            <main className="max-h-[90vh] h-[90vh] w-full">
                <DayList items={assignmentItems} />
            </main>
            <Footer />
        </div>
    );
}
