"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AssignmentViewToggleProps {
    view: "current" | "past";
    onViewChange: (view: "current" | "past") => void;
    currentCount?: number;
    pastCount?: number;
}

export function AssignmentViewToggle({
    view,
    onViewChange,
    currentCount,
    pastCount,
}: AssignmentViewToggleProps) {
    const [hoveredView, setHoveredView] = useState<"current" | "past" | null>(null);

    return (
        <div className="flex items-center gap-2 p-1 bg-gray-100 border-2 border-black rounded-full w-fit mx-auto mb-4">
            <Button
                variant="ghost"
                onClick={() => onViewChange("current")}
                onMouseEnter={() => setHoveredView("current")}
                onMouseLeave={() => setHoveredView(null)}
                className={cn(
                    "rounded-full px-6 py-2 transition-all duration-200 font-asul relative",
                    view === "current"
                        ? "bg-black hover:bg-black hover:text-white text-white shadow-md"
                        : "text-black"
                )}
            >
                <span className="flex items-center gap-2">
                    Current
                    {hoveredView === "current" && view === "current" && typeof currentCount === "number" && (
                        <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] px-1.5 animate-in fade-in zoom-in-95 duration-200">
                            {currentCount > 99 ? "99+" : currentCount}
                        </span>
                    )}
                </span>
            </Button>
            <Button
                variant="ghost"
                onClick={() => onViewChange("past")}
                onMouseEnter={() => setHoveredView("past")}
                onMouseLeave={() => setHoveredView(null)}
                className={cn(
                    "rounded-full px-6 py-2 transition-all duration-200 font-asul relative",
                    view === "past"
                        ? "bg-black hover:bg-black hover:text-white text-white shadow-md"
                        : "text-black"
                )}
            >
                <span className="flex items-center gap-2">
                    Past
                    {hoveredView === "past" && view === "past" && typeof pastCount === "number" && (
                        <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] px-1.5 animate-in fade-in zoom-in-95 duration-200">
                            {pastCount > 99 ? "99+" : pastCount}
                        </span>
                    )}
                </span>
            </Button>
        </div>
    );
}

