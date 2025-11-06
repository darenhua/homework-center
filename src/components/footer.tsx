import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { mapColorToBg } from "@/lib/color-to-bg";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    UrlStatusTooltip,
} from "@/components/ui/tooltip";
import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

export interface SourceInfo {
    url: string | null;
    synced: boolean;
}

interface CourseWithColor {
    id: string;
    created_at: string;
    title: string | null;
    source: SourceInfo[];
    color: string;
}

function CoursesBar() {
    const { session } = useAuth();
    console.log("CoursesBar", session);

    const coursesQuery = useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const response = await apiClient.GET("/courses");
            if (response.data) {
                return response.data as CourseWithColor[];
            }
            throw new Error("Failed to fetch courses");
        },
        enabled: !!session,
    });

    if (coursesQuery.isLoading) {
        return (
            <div className="flex items-center justify-center">
                <Skeleton className="h-8 w-32" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            {coursesQuery.error && (
                <div>Error loading courses: {coursesQuery.error.message}</div>
            )}

            <div className="mr-3 flex gap-3 items-center">
                <div className="font-bold mr-2 text-muted-foreground select-none">
                    Courses
                </div>

                {coursesQuery.data?.map((course) => (
                    <CourseButton key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}
function ProfileButton() {
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
        <div className="relative flex gap-6 items-center" ref={menuRef}>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
                {user?.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt="User avatar"
                        referrerPolicy="no-referrer"
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
            <div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-full shadow-sm">
                    <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        cuhomeworkcenter
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium bg-orange-500 text-white rounded-full">
                        BETA
                    </span>
                </div>
            </div>
            {isMenuOpen && (
                <div className="absolute bottom-16 left-0 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-200">
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
    );
}

function CourseButton({ course }: { course: CourseWithColor }) {
    // const anyNotSynced = course.source.some((src) => !src.synced);
    const anyNotSynced = false;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {anyNotSynced ? (
                        <div className="w-6 h-6 cursor-pointer text-red-200 text-sm  border-red-800 border-2 rounded-full bg-red-500 font-bold flex items-center justify-center shadow-lg ">
                            {/* onclick it should bring up a modal with instructions */}
                            !
                        </div>
                    ) : (
                        <button
                            className={`w-6 h-6 border-primary border-2 rounded-full ${mapColorToBg(course.color)} text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200`}
                        />
                    )}
                </TooltipTrigger>

                <UrlStatusTooltip
                    title={`${course.title}`}
                    urls={course.source}
                />
            </Tooltip>
        </TooltipProvider>
    );
}

function Footer() {
    return (
        <div className="fixed bg-white border-t border-border bottom-0 left-0 right-0 p-4 flex justify-between">
            <ProfileButton />
            <CoursesBar />
        </div>
    );
}

export default Footer;
