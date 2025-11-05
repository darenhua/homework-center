import { Checkbox } from "@/components/ui/checkbox";
import type { Tables } from "../../../database.types";

interface CourseGridProps {
    courses: Tables<"courses">[];
    selectedCourses: Set<string>;
    onCourseToggle: (courseId: string) => void;
    maxSelections?: number;
}

const colorToGradient: Record<string, string> = {
    red: "from-red-400 to-red-600",
    green: "from-green-400 to-green-600",
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    orange: "from-orange-400 to-orange-600",
    pink: "from-pink-400 to-pink-600",
    brown: "from-amber-600 to-amber-800",
    yellow: "from-yellow-400 to-yellow-600",
};

export function CourseGrid({
    courses,
    selectedCourses,
    onCourseToggle,
    maxSelections = 10,
}: CourseGridProps) {
    return (
        <div className="grid font-asul grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
                const isSelected = selectedCourses.has(course.id);
                const isDisabled =
                    !isSelected && selectedCourses.size >= maxSelections;
                const gradient =
                    colorToGradient[course.color || "blue"] ||
                    "from-blue-400 to-blue-600";

                return (
                    <div
                        key={course.id}
                        className={`group relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                            if (isDisabled) return;
                            onCourseToggle(course.id);
                        }}
                    >
                        <div
                            className={`relative rounded-2xl overflow-hidden shadow-lg ${
                                isSelected
                                    ? "ring-4 ring-orange-500 ring-offset-2"
                                    : "shadow-md hover:shadow-xl"
                            }`}
                        >
                            {/* Gradient background */}
                            <div
                                className={`h-32 bg-gradient-to-br ${gradient} relative`}
                            >
                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-white rounded-full p-1.5 shadow-lg">
                                            <svg
                                                className="w-5 h-5 text-orange-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="bg-white p-5">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                        {course.title}
                                    </h3>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() =>
                                            onCourseToggle(course.id)
                                        }
                                        disabled={isDisabled}
                                        className="mt-0.5 pointer-events-none hidden"
                                    />
                                </div>
                            </div>

                            {/* Hover overlay */}
                            {!isDisabled && (
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
