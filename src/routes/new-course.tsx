import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { CreateCourseDialog, CourseGrid } from "@/components/courses";
import { useAddUserCourses } from "@/hooks/mutations";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api-client";
import type { components } from "@/types/schema.gen";

type CourseWithColor = components["schemas"]["CourseWithColor"];

export const Route = createFileRoute("/new-course")({
    component: NewCoursePage,
});

function NewCoursePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
        new Set()
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Query all courses with colors from API
    const { data: courses, isLoading } = useQuery({
        queryKey: ["available-courses"],
        queryFn: async () => {
            // Get user's courses
            const { data: userCourses } = await supabase
                .from("user_courses")
                .select("course_id")
                .eq("user_id", user!.id);

            const userCourseIds = new Set(
                userCourses?.map((uc) => uc.course_id) || []
            );

            // Fetch all courses with colors from API
            const coursesResponse = await apiClient.GET("/courses");
            if (coursesResponse.error)
                throw new Error("Failed to fetch courses");

            const allCourses = (coursesResponse.data || []) as CourseWithColor[];

            // Filter out courses the user already has
            const availableCourses = allCourses.filter(
                (course) => !userCourseIds.has(course.id)
            );

            // Sort by created_at descending
            return availableCourses.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            );
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
        <div className="mt-6 font-asul min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Select Your Courses
                    </h1>
                    <p className="text-lg text-gray-600">
                        Choose up to 10 courses to get started
                    </p>
                </div>

                {/* Selection Counter and Actions */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {selectedCourses.size > 0 && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {selectedCourses.size} course
                                {selectedCourses.size !== 1 ? "s" : ""}{" "}
                                selected
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            variant="outline"
                        >
                            New Course
                        </Button>
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
                                            navigate({ to: "/" });
                                        },
                                    }
                                )
                            }
                            disabled={
                                selectedCourses.size === 0 ||
                                addUserCoursesMutation.isPending
                            }
                            className="px-6 py-2 text-base font-medium"
                        >
                            {addUserCoursesMutation.isPending
                                ? "Adding..."
                                : "Add Courses"}
                        </Button>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="h-32 w-full rounded-2xl" />
                                    <Skeleton className="h-6 w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : courses && courses.length > 0 ? (
                        <CourseGrid
                            courses={courses}
                            selectedCourses={selectedCourses}
                            onCourseToggle={handleCourseToggle}
                            maxSelections={10}
                        />
                    ) : (
                        <div className="text-center py-20">
                            <div className="mb-4">
                                <svg
                                    className="mx-auto h-16 w-16 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <p className="text-xl font-medium text-gray-900 mb-2">
                                No courses available
                            </p>
                            <p className="text-gray-600 mb-6">
                                Create your first course to get started!
                            </p>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="px-6"
                            >
                                Create Course
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
