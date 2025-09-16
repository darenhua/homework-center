import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import Footer from "@/components/footer";
import apiClient from "@/lib/api-client";

export const Route = createFileRoute("/")({
    component: App,
});

function CourseCard({ course }: { course: CourseWithColor }) {
    return (
        <div
            className="p-4 border rounded-lg"
            style={{ borderColor: course.color }}
        >
            <h3 className="font-semibold">
                {course.title || "Untitled Course"}
            </h3>
            <div className="mt-2 text-sm text-gray-600">
                {course.source.length > 0 ? (
                    <div>
                        {course.source.map((src, idx) => (
                            <div key={idx}>
                                {src.url || "No URL"} -{" "}
                                {src.synced ? "Synced" : "Not synced"}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No sources</div>
                )}
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="flex flex-col items-center p-8">
            <h1 className="text-2xl font-bold mb-6">My Courses</h1>

            <Footer />
        </div>
    );
}
