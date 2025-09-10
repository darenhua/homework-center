import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "../../../database.types";
import * as z from "zod";

export const createCourseSchema = z.object({
    title: z.string().min(1, "Title is required"),
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: CreateCourseFormValues) => {
            const newCourse: TablesInsert<"courses"> = {
                title: values.title,
            };

            const { data, error } = await supabase
                .from("courses")
                .insert(newCourse)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });
}
