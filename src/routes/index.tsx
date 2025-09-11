import { createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

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

function Footer() {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMenuOpen(false);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-end">
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                >
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt="User avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    )}
                </button>

                {isMenuOpen && (
                    <div className="absolute bottom-16 right-0 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border mb-2">
                            {user?.email}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function App() {
    const { session } = useAuth();
    console.log("session", session);
    const assignments = useQuery({
        queryKey: ["assignments"],
        queryFn: () =>
            fetch("https://jsonplaceholder.typicode.com/todos").then(
                (res) => res.json() as Promise<Assignment[]>
            ),
    });

    return (
        <div className="flex flex-col items-center">
            <iframe src="https://www.reddit.com/"></iframe>

            {assignments.data?.map((assignment) => (
                <AssignmentListItem
                    key={assignment.id}
                    assignment={assignment}
                />
            ))}
            <Footer />
        </div>
    );
}
