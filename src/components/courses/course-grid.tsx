import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Tables } from "../../../database.types";

interface CourseGridProps {
    courses: Tables<"courses">[];
    selectedCourses: Set<string>;
    onCourseToggle: (courseId: string) => void;
    maxSelections?: number;
}

export function CourseGrid({
    courses,
    selectedCourses,
    onCourseToggle,
    maxSelections = 10,
}: CourseGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {courses.map((course) => (
                <Card
                    key={course.id}
                    className={`cursor-pointer transition-all relative hover:bg-gray-50 ${
                        selectedCourses.has(course.id)
                            ? "ring-2 ring-orange-500"
                            : ""
                    }`}
                    onClick={() => {
                        if (
                            !selectedCourses.has(course.id) &&
                            selectedCourses.size >= maxSelections
                        ) {
                            return;
                        }
                        onCourseToggle(course.id);
                    }}
                >
                    <CardContent className="p-4 h-full flex flex-col">
                        <div className="absolute top-3 left-3">
                            <Checkbox
                                checked={selectedCourses.has(course.id)}
                                onCheckedChange={() =>
                                    onCourseToggle(course.id)
                                }
                                disabled={
                                    !selectedCourses.has(course.id) &&
                                    selectedCourses.size >= maxSelections
                                }
                                className="pointer-events-none" // Prevents checkbox from capturing click events
                            />
                        </div>
                        <div className="mt-8 text-lg font-medium">
                            {course.title}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
