import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "../../../database.types";
import { useNavigate } from "@tanstack/react-router";

export function useAddUserCourses() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async ({
            userId,
            selectedCourses,
        }: {
            userId: string;
            selectedCourses: Set<string>;
        }) => {
            if (!userId || selectedCourses.size === 0) {
                throw new Error("No user or no courses selected");
            }

            const userCourses: TablesInsert<"user_courses">[] = Array.from(
                selectedCourses
            ).map((courseId) => ({
                user_id: userId,
                course_id: courseId,
            }));

            const { error } = await supabase
                .from("user_courses")
                .insert(userCourses);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-courses"] });
            navigate({ to: "/" });
        },
    });
}
