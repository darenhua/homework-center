import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Tables } from "../../database.types";
import { useNavigate } from "@tanstack/react-router";

type User = Tables<"users">;

interface AuthContextType {
    user: User | null;
    session: Session | null;
}

async function getUserProfile(
    supabaseUser: SupabaseUser
): Promise<User | null> {
    console.log("getUserProfile", supabaseUser);
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", supabaseUser.id)
        .single();

    if (error) {
        console.error("Error getting user profile:", error);
        return null;
    }

    return data;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("AuthProvider useEffect");
        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setSession(session);

            // Check profile on sign in and initial session
            if (currentUser) {
                const userProfile = await getUserProfile(currentUser);
                setUser(userProfile);
                
                // Check if user has any courses (only redirect from home page)
                if (userProfile) {
                    const currentPath = window.location.pathname;
                    
                    // Only check for courses if user is on the home page
                    if (currentPath === "/" || currentPath === "") {
                        const { data: userCourses, error } = await supabase
                            .from("user_courses")
                            .select("course_id")
                            .eq("user_id", userProfile.id)
                            .limit(1);
                        
                        if (!error && (!userCourses || userCourses.length === 0)) {
                            // User has no courses, redirect to course selection
                            navigate({ to: "/new-course" });
                        }
                    }
                }
            } else if (!currentUser) {
                setUser(null);
                setSession(null);
                navigate({ to: "/login" });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);
    return (
        <AuthContext.Provider value={{ user, session }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
