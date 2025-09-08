import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth-context";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

function LoginPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate({ to: "/" });
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) {
            console.error("Error logging in:", error.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <h1>HomeworkCenter</h1>
            <button
                onClick={handleLogin}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
                Sign in with Google
            </button>
        </div>
    );
}
