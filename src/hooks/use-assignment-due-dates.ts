import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export interface DueDate {
    id: string;
    title: string | null;
    date: string;
    source_url: string | null;
    selected: boolean;
}

interface UseAssignmentDueDatesParams {
    assignmentId: string;
    enabled?: boolean;
}

export function useAssignmentDueDates({
    assignmentId,
    enabled = true,
}: UseAssignmentDueDatesParams) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["assignment-due-dates", assignmentId, user?.id],
        queryFn: async () => {
            if (!user) throw new Error("User not authenticated");

            // Step 1: Get assignment with course info
            const assignmentResult = await supabase
                .from("assignments")
                .select("*, courses(*, sources(*))")
                .eq("id", assignmentId)
                .single();

            if (assignmentResult.error) {
                throw new Error("Failed to fetch assignment");
            }

            const assignment = assignmentResult.data;
            let chosenDueDateId = assignment?.chosen_due_date_id;

            // Step 2: Check if user has a user_assignment override
            const userAssignmentResult = await supabase
                .from("user_assignments")
                .select("chosen_due_date_id")
                .eq("assignment_id", assignmentId)
                .eq("user_id", user.id)
                .maybeSingle();

            if (userAssignmentResult.data?.chosen_due_date_id) {
                chosenDueDateId = userAssignmentResult.data.chosen_due_date_id;
            }

            // Step 3: Get sources from the course
            const course = assignment?.courses as any;
            const sources = (course?.sources as any[]) || [];
            const sourceUrl = sources[0]?.url || null;

            // Step 4: Fetch all due dates for this assignment
            const dueDatesResult = await supabase
                .from("due_dates")
                .select("*")
                .eq("assignment_id", assignmentId)
                .order("date", { ascending: true });

            if (dueDatesResult.error) {
                throw new Error("Failed to fetch due dates");
            }

            // Step 5: Process due dates
            const dueDates: DueDate[] =
                dueDatesResult.data?.map((dd) => ({
                    id: dd.id,
                    title: dd.title,
                    date: dd.date,
                    source_url: sourceUrl,
                    selected: dd.id === chosenDueDateId,
                })) || [];

            return {
                dueDates,
                assignment: assignment,
                course: course,
            };
        },
        enabled: enabled && !!assignmentId && !!user,
    });
}

