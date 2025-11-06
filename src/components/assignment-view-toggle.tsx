"use client";

import { Calendar, History } from "lucide-react";

interface AssignmentViewToggleProps {
    view: "current" | "past";
    onViewChange: (view: "current" | "past") => void;
}

export function AssignmentViewToggle({
    view,
    onViewChange,
}: AssignmentViewToggleProps) {
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white border-2 border-black rounded-full p-1.5 shadow-lg flex gap-1">
                <button
                    onClick={() => onViewChange("current")}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-full font-asul font-semibold
                        transition-all
                        ${
                            view === "current"
                                ? "bg-black text-white shadow-md scale-105"
                                : "bg-transparent text-black"
                        }
                    `}
                    aria-label="View current assignments"
                >
                    <Calendar className="w-4 h-4" />
                    <span>Current</span>
                </button>
                <button
                    onClick={() => onViewChange("past")}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-full font-asul font-semibold
                        transition-all duration-300 ease-in-out
                        ${
                            view === "past"
                                ? "bg-black text-white shadow-md scale-105"
                                : "bg-transparent text-black"
                        }
                    `}
                    aria-label="View past assignments"
                >
                    <History className="w-4 h-4" />
                    <span>Past</span>
                </button>
            </div>
        </div>
    );
}

