import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { CreateCourseDialog, CourseGrid } from "@/components/courses";
import { useAddUserCourses } from "@/hooks/mutations";
import type { Tables } from "../../database.types";

export const Route = createFileRoute("/new-course")({
    component: NewCoursePage,
});

function NewCoursePage() {
    const { user } = useAuth();
    const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
        new Set()
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Query all courses
    const { data: courses, isLoading } = useQuery({
        queryKey: ["available-courses"],
        queryFn: async () => {
            const { data: userCourses } = await supabase
                .from("user_courses")
                .select("course_id")
                .eq("user_id", user!.id);

            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .not(
                    "id",
                    "in",
                    `(${(userCourses?.map((course) => course.course_id) || []).join(",")})`
                )
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as Tables<"courses">[];
        },
    });

    const addUserCoursesMutation = useAddUserCourses();

    const handleCourseToggle = (courseId: string) => {
        const newSelected = new Set(selectedCourses);
        if (newSelected.has(courseId)) {
            newSelected.delete(courseId);
        } else {
            if (newSelected.size < 10) {
                newSelected.add(courseId);
            }
        }
        setSelectedCourses(newSelected);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side */}
            <div className="w-1/2 p-8 border-r">
                <h1 className="text-3xl font-bold mb-6">Select your courses</h1>

                {selectedCourses.size > 0 && (
                    <p className="text-lg mb-4">
                        {selectedCourses.size} courses selected
                    </p>
                )}

                <CreateCourseDialog
                    isOpen={isModalOpen}
                    onOpenChange={setIsModalOpen}
                />

                <Button
                    onClick={() =>
                        addUserCoursesMutation.mutate(
                            {
                                userId: user!.id,
                                selectedCourses,
                            },
                            {
                                onSuccess: () => {
                                    setSelectedCourses(new Set());
                                },
                            }
                        )
                    }
                    disabled={
                        selectedCourses.size === 0 ||
                        addUserCoursesMutation.isPending
                    }
                >
                    {addUserCoursesMutation.isPending
                        ? "Adding..."
                        : "Add Courses"}
                </Button>
            </div>

            {/* Right side - Course Grid */}
            <div className="w-1/2 p-8">
                {isLoading ? (
                    <p>Loading courses...</p>
                ) : courses && courses.length > 0 ? (
                    <CourseGrid
                        courses={courses}
                        selectedCourses={selectedCourses}
                        onCourseToggle={handleCourseToggle}
                        maxSelections={10}
                    />
                ) : (
                    <p className="text-gray-500">
                        No courses available. Create your first course!
                    </p>
                )}
            </div>
        </div>
    );
}
