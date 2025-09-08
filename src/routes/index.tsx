import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
    component: App,
});

interface Assignment {
    id: number;
    title: string;
    courseName: string;
    dueDate: string;
}

function AssignmentListItem({ assignment }: { assignment: Assignment }) {
    return <div>{assignment.title} - duedate</div>;
}

function App() {
    const { user } = useAuth();
    console.log(user);
    const assignments = useQuery({
        queryKey: ["assignments"],
        queryFn: () =>
            fetch("https://jsonplaceholder.typicode.com/todos").then(
                (res) => res.json() as Promise<Assignment[]>
            ),
    });

    return (
        <div className="flex flex-col items-center">
            {assignments.data?.map((assignment) => (
                <AssignmentListItem
                    key={assignment.id}
                    assignment={assignment}
                />
            ))}
        </div>
    );
}
