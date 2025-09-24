"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AssignmentProps {
    title: string;
    number?: number;
    color?: string;
    onClick?: () => void;
    onCardClick?: () => void;
}

export function Assignment({
    title,
    number,
    color = "bg-yellow-200",
    onClick,
    onCardClick,
}: AssignmentProps) {
    return (
        <div className="relative">
            {/* Assignment card */}
            <div
                className={`${color} border-2 border-black rounded-2xl p-4 flex items-center gap-4 shadow-sm cursor-pointer`}
                onClick={onCardClick}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="w-6 h-6 rounded-full border-2 border-black bg-white" />
                </button>

                {/* Title */}
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-black">{title}</h3>
                </div>

                {/* Arrow button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-2 cursor-pointer border-black rounded-lg px-4 w-20 py-2 hover:bg-gray-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.();
                    }}
                >
                    <ArrowRight className="w-4 h-4 text-black" />
                </Button>
            </div>

            {/* Number badge */}
            {number && (
                <div
                    className={`absolute -top-2 -right-2 w-6 h-6 ${number > 1 ? "bg-red-300" : "bg-white"} border-2 border-black rounded-full flex items-center justify-center`}
                >
                    <span className={`text-sm text-black`}>{number}</span>
                </div>
            )}
        </div>
    );
}
