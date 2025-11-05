"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfiniteList } from "../infinite-list";
import { CheckCircle2, Calendar, ExternalLink } from "lucide-react";

import apiClient from "@/lib/api-client";
import type { components } from "@/types/schema.gen";

type DueDate = components["schemas"]["DueDate"];

interface DueDatesProps {
    assignmentId: string;
}

const getDueDates = async (page: number, assignmentId: string) => {
    const pageSize = 10;
    const { data, error } = await apiClient.GET(
        `/assignments/{assignment_id}/dates`,
        {
            params: {
                path: { assignment_id: assignmentId },
                query: { page, limit: pageSize },
            },
        }
    );

    if (error) throw new Error("Failed to fetch due dates");

    return {
        data: data.data,
        hasMore: data.hasMore,
    };
};

export default function DueDatesList({ assignmentId }: DueDatesProps) {
    const renderDueDate = (dueDate: DueDate) => {
        const formattedDate = dueDate.date
            ? new Date(dueDate.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  weekday: "long",
              })
            : "No date specified";

        return (
            <Card
                key={dueDate.source_url}
                className={`p-4 transition-all hover:shadow-md ${
                    dueDate.selected
                        ? "border-2 border-green-500 bg-green-50/50"
                        : "border"
                }`}
            >
                <div className="flex items-start gap-3">
                    <div className="pt-1">
                        {dueDate.selected ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                            <Checkbox defaultChecked={false} />
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm leading-relaxed">
                                {dueDate.title || "Untitled"}
                            </p>
                            {dueDate.selected && (
                                <Badge
                                    variant="outline"
                                    className="bg-green-100 border-green-300 text-green-700 text-xs"
                                >
                                    Selected
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formattedDate}</span>
                            </div>
                            {dueDate.source_url && (
                                <>
                                    <span>•</span>
                                    <a
                                        href={dueDate.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-foreground hover:underline"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>Source</span>
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    const fetchDueDates = (page: number) => getDueDates(page, assignmentId);

    return (
        <div className="h-full">
            <InfiniteList
                queryKey={["dueDates", assignmentId]}
                fetchFn={fetchDueDates}
                renderItem={renderDueDate}
                pageSize={10}
            />
        </div>
    );
}
