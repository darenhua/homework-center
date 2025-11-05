"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Assignment } from "./assignment";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import type { Tables } from "../../../database.types";
import { ExternalLink } from "lucide-react";

export interface AssignmentDetailsProps {
    assignmentId: string;
    title: string;
    number?: number;
    color?: string;
    courseTitle?: string;
}

interface DueDateWithSelection extends Tables<"due_dates"> {
    selected: boolean;
}

interface AssignmentData {
    assignment: Tables<"assignments"> & {
        courses: Tables<"courses"> & {
            sources: Tables<"sources">[];
        };
    };
    dueDates: DueDateWithSelection[];
    chosenDueDate: Tables<"due_dates"> | null;
}

export function AssignmentDetails({
    assignmentId,
    title,
    number,
    color = "bg-yellow-200",
    courseTitle,
}: AssignmentDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(
        null
    );
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && !assignmentData) {
            fetchAssignmentData();
        }
    }, [isOpen]);

    const fetchAssignmentData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Fetch assignment with course and sources
            const { data: assignmentResult, error: assignmentError } =
                await supabase
                    .from("assignments")
                    .select("*, courses!course_id(*, sources!course_id(*))")
                    .eq("id", assignmentId)
                    .single();

            if (assignmentError) throw assignmentError;

            // Check if user has a user_assignment override
            const { data: userAssignmentResult } = await supabase
                .from("user_assignments")
                .select("chosen_due_date_id")
                .eq("assignment_id", assignmentId)
                .eq("user_id", user.id)
                .maybeSingle();

            // Determine which due date is chosen
            const chosenDueDateId =
                userAssignmentResult?.chosen_due_date_id ||
                assignmentResult.chosen_due_date_id;

            // Fetch all due dates for this assignment
            const { data: dueDatesResult, error: dueDatesError } =
                await supabase
                    .from("due_dates")
                    .select("*")
                    .eq("assignment_id", assignmentId)
                    .order("date", { ascending: true });

            if (dueDatesError) throw dueDatesError;

            // Mark the selected due date
            const dueDatesWithSelection = (dueDatesResult || []).map((dd) => ({
                ...dd,
                selected: dd.id === chosenDueDateId,
            }));

            // Get the chosen due date details
            const chosenDueDate =
                dueDatesWithSelection.find((dd) => dd.selected) || null;

            setAssignmentData({
                assignment: assignmentResult as any,
                dueDates: dueDatesWithSelection,
                chosenDueDate,
            });
        } catch (error) {
            console.error("Error fetching assignment data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDueDateSelect = async (dueDateId: string) => {
        if (!user) return;

        try {
            // Check if user_assignment exists
            const { data: existingUserAssignment } = await supabase
                .from("user_assignments")
                .select("id")
                .eq("assignment_id", assignmentId)
                .eq("user_id", user.id)
                .maybeSingle();

            if (existingUserAssignment) {
                // Update existing
                await supabase
                    .from("user_assignments")
                    .update({ chosen_due_date_id: dueDateId })
                    .eq("id", existingUserAssignment.id);
            } else {
                // Create new
                await supabase.from("user_assignments").insert({
                    assignment_id: assignmentId,
                    user_id: user.id,
                    chosen_due_date_id: dueDateId,
                });
            }

            // Refresh data
            setAssignmentData(null);
            fetchAssignmentData();
        } catch (error) {
            console.error("Error updating chosen due date:", error);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "No date";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            weekday: "long",
            year: "numeric",
        });
    };

    const getSourceUrl = () => {
        return assignmentData?.assignment?.courses?.sources?.[0]?.url || null;
    };

    return (
        <>
            <Assignment
                title={title}
                number={number}
                color={color}
                onCardClick={() => setIsOpen(true)}
                url={getSourceUrl()}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="font-asul max-w-3xl max-h-[90vh] p-0 bg-white border-2 border-black rounded-3xl overflow-hidden">
                    {loading ? (
                        <div className="p-8 space-y-4">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : assignmentData ? (
                        <div className="flex flex-col h-full">
                            {/* Header Section */}
                            <div className={`${color} border-b-2 border-black p-6`}>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full border-2 border-black bg-white flex-shrink-0 mt-1" />
                                    <div className="flex-1 space-y-3">
                                        <h2 className="text-2xl font-bold text-black">
                                            {assignmentData.chosenDueDate?.title ||
                                                title ||
                                                "Untitled Assignment"}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                        {courseTitle && (
                                            <Badge
                                                variant="outline"
                                                className="bg-white border-2 border-black text-black font-medium"
                                            >
                                                {courseTitle}
                                            </Badge>
                                        )}
                                        {getSourceUrl() && (
                                            <a
                                                href={getSourceUrl()!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className={`${color.replace("200", "300")} border-2 border-black text-black font-medium hover:opacity-80 cursor-pointer transition-colors`}
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    View source
                                                </Badge>
                                            </a>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Due Dates List Section */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <h3 className="text-lg font-semibold mb-4 text-black">
                                    All Due Dates ({assignmentData.dueDates.length})
                                </h3>
                                {assignmentData.dueDates.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">
                                        No due dates found for this assignment
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {assignmentData.dueDates.map((dueDate) => (
                                            <div
                                                key={dueDate.id}
                                                onClick={() =>
                                                    handleDueDateSelect(dueDate.id)
                                                }
                                                className={`
                                                    border-2 border-black rounded-xl p-4 cursor-pointer
                                                    transition-all duration-200
                                                    ${
                                                        dueDate.selected
                                                            ? "bg-green-200 shadow-md"
                                                            : "bg-white hover:bg-gray-50"
                                                    }
                                                `}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`
                                                        w-5 h-5 rounded-full border-2 border-black flex-shrink-0 mt-0.5
                                                        ${
                                                            dueDate.selected
                                                                ? "bg-black"
                                                                : "bg-white"
                                                        }
                                                    `}
                                                    >
                                                        {dueDate.selected && (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-white rounded-full" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-black">
                                                            {dueDate.title ||
                                                                "Untitled"}
                                                        </p>
                                                        <p className="text-sm text-gray-700 mt-1">
                                                            {formatDate(dueDate.date)}
                                                        </p>
                                                        <div className="flex gap-2 mt-2">
                                                            {dueDate.date_certain && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    Date Certain
                                                                </Badge>
                                                            )}
                                                            {dueDate.time_certain && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    Time Certain
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            Failed to load assignment data
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
