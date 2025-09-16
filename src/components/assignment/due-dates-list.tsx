"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { InfiniteList } from "../infinite-list";

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
    const renderDueDate = (dueDate: DueDate) => (
        <Card key={dueDate.source_url} className="p-4">
            <div className="flex items-center gap-3">
                <Checkbox defaultChecked={dueDate.selected} />
                <div className="flex-1">
                    <p className="text-sm font-medium">{dueDate.title}</p>
                    {dueDate.date && (
                        <p className="text-xs text-muted-foreground">
                            {new Date(dueDate.date).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );

    const fetchDueDates = (page: number) => getDueDates(page, assignmentId);

    return (
        <div className="h-[600px] p-4">
            <InfiniteList
                queryKey={["dueDates", assignmentId]}
                fetchFn={fetchDueDates}
                renderItem={renderDueDate}
                pageSize={10}
            />
        </div>
    );
}
