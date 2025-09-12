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
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            // if (session == null) {
            //     navigate({ to: "/login" });
            //     return;
            // }
            setSession(session);
            const currentUser = session?.user ?? null;
            if (currentUser) {
                const profile = await getUserProfile(currentUser);
                setUser(profile);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentUser = session?.user ?? null;
            setSession(session);

            // Check profile on sign in and initial session
            if (currentUser) {
                const userProfile = await getUserProfile(currentUser);
                setUser(userProfile);
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
