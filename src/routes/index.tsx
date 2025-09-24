import { createFileRoute } from "@tanstack/react-router";
import { mapColorToBg } from "@/lib/color-to-bg";
import Footer from "@/components/footer";
import { useAssignments } from "@/hooks/use-assignments";
import { DayList } from "@/components/days/day-list";
import type { DayItem } from "@/components/days/day";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    const { data: assignments, isLoading, error } = useAssignments();
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

    if (isLoading) {
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
