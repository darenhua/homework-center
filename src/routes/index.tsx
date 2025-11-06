import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { mapColorToBg } from "@/lib/color-to-bg";
import Footer from "@/components/footer";
import { useAssignments } from "@/hooks/use-assignments";
import { usePastAssignments } from "@/hooks/use-past-assignments";
import { DayList } from "@/components/days/day-list";
import { PastDayList } from "@/components/days/past-day-list";
import type { DayItem } from "@/components/days/day";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignmentViewToggle } from "@/components/assignment/assignment-view-toggle";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState<"current" | "past">("current");
    const { data: assignments, isLoading, error } = useAssignments();
    const {
        data: pastAssignments,
        isLoading: isLoadingPast,
        error: pastError,
    } = usePastAssignments();

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
                assignmentId: assignment.assignment_id,
                title: assignment.title || "Untitled Assignment",
                date: formattedDate,
                color: mapColorToBg(assignment.course.color),
                courseTitle: assignment.course.title || "Untitled Course",
            };
        }) || [];

    // Convert past assignments to DayItem format
    const pastAssignmentItems: DayItem[] =
        pastAssignments?.map((assignment) => {
            // Format the date to YYYY-MM-DD for the day-list component
            let formattedDate = new Date().toISOString().split("T")[0];
            if (assignment.due_date) {
                const date = new Date(assignment.due_date);
                formattedDate = date.toISOString().split("T")[0];
            }

            return {
                id: assignment.assignment_id,
                assignmentId: assignment.assignment_id,
                title: assignment.title || "Untitled Assignment",
                date: formattedDate,
                color: mapColorToBg(assignment.course.color),
                courseTitle: assignment.course.title || "Untitled Course",
            };
        }) || [];

    // Show loading while checking courses or loading assignments
    const isLoadingView =
        view === "current"
            ? isLoading || userCourses === undefined
            : isLoadingPast || userCourses === undefined;
    const viewError = view === "current" ? error : pastError;
    const viewItems = view === "current" ? assignmentItems : pastAssignmentItems;

    if (isLoadingView) {
        return (
            <div className="flex flex-col h-screen items-center font-asul">
                <main className="max-h-[90vh] h-[90vh] w-full p-6">
                    <div className="space-y-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-2 max-w-[1000px] mx-auto">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-20 w-full  mx-auto rounded-lg" />
                            </div>
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (viewError) {
        return (
            <div className="flex flex-col h-screen items-center justify-center">
                <div>Error loading assignments</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen items-center font-asul">
            <main className="max-h-[90vh] h-[90vh] w-full flex flex-col">
                <div className="pt-4 pb-2 flex-shrink-0">
                    <AssignmentViewToggle 
                        view={view} 
                        onViewChange={setView}
                        currentCount={assignmentItems.length}
                        pastCount={pastAssignmentItems.length}
                    />
                </div>
                <div className="flex-1 overflow-hidden">
                    {view === "current" ? (
                        <DayList items={viewItems} />
                    ) : (
                        <PastDayList items={viewItems} />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
