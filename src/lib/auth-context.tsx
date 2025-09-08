import { createContext, useContext, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Tables } from "../../database.types";

type User = Tables<"users">;

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

async function ensureUserProfile(
    supabaseUser: SupabaseUser
): Promise<User | null> {
    // First check if user profile exists
    const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

    if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Error checking user profile:", fetchError);
        return null;
    }

    // If user doesn't exist, create profile as fallback
    if (!user) {
        const newProfile = {
            email: supabaseUser.email,
            full_name: supabaseUser.user_metadata.full_name,
            avatar_url: supabaseUser.user_metadata.avatar_url,
        };

        const { data: createdUser, error: insertError } = await supabase
            .from("users")
            .insert(newProfile)
            .select()
            .single();

        if (insertError) {
            console.error("Error creating user profile:", insertError);
            return null;
        }

        return createdUser;
    }

    return user;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AuthProvider useEffect");
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            if (currentUser) {
                ensureUserProfile(currentUser).then(setUser);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentUser = session?.user ?? null;

            // Check/create profile on sign in and initial session
            if (
                currentUser &&
                (event === "SIGNED_IN" || event === "INITIAL_SESSION")
            ) {
                const userProfile = await ensureUserProfile(currentUser);
                setUser(userProfile);
            } else if (!currentUser) {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
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
