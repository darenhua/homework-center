import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { useState } from "react";
import { queryOptions, useQuery, useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/admin")({
    component: AdminPage,
});

interface SyncStatus {
    job_sync_group_id: string;
    status: "running" | "completed";
    created_at: string;
    completed_at?: string;
    job_syncs_created: number;
    result?: {
        job_syncs_created: number;
        courses_scraped: number;
        assignments_found: number;
        due_dates_found: number;
        duration_seconds: number;
    };
}

const syncStatusQueryOptions = () =>
    queryOptions<SyncStatus>({
        queryKey: ["sync-status"],
        queryFn: async () => {
            const { data } = await apiClient.GET(
                "/sync-courses-temporal/latest-status",
                {}
            );
            return data! as SyncStatus;
        },
        refetchInterval: 2000, // Poll every 2 seconds
    });

function AdminPage() {
    const { user } = useAuth();
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const { data: status, error } = useQuery(syncStatusQueryOptions());

    const syncMutation = useMutation({
        mutationFn: async () => {
            const { data } = await apiClient.POST("/sync-courses-temporal", {
                body: {},
            });
            return data;
        },
    });

    if (!user) {
        return null;
    }

    // Check if user email is the admin email
    if (user.email !== "dh3243@columbia.edu") {
        return <Navigate to="/" />;
    }

    const handleTriggerSync = () => {
        setButtonDisabled(true);
        syncMutation.mutate();

        setTimeout(() => {
            setButtonDisabled(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen items-center justify-center p-8">
            <div className="max-w-2xl w-full space-y-6">
                <h1 className="text-3xl font-bold">Admin Panel</h1>

                <div className="space-y-4">
                    <button
                        onClick={handleTriggerSync}
                        disabled={buttonDisabled}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Trigger Sync
                    </button>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded">
                            Error: {error.message}
                        </div>
                    )}

                    {status && (
                        <div className="p-4 bg-white border rounded-lg shadow">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">
                                        Sync Status
                                    </h2>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            status.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {status.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Job Group ID
                                        </p>
                                        <p className="font-mono text-sm">
                                            {status.job_sync_group_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Job Syncs Created
                                        </p>
                                        <p className="font-semibold">
                                            {status.job_syncs_created}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Created At
                                        </p>
                                        <p className="text-sm">
                                            {new Date(
                                                status.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    {status.completed_at && (
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Completed At
                                            </p>
                                            <p className="text-sm">
                                                {new Date(
                                                    status.completed_at
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {status.result && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h3 className="font-semibold mb-2">
                                            Results
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Courses Scraped
                                                </p>
                                                <p className="font-semibold">
                                                    {
                                                        status.result
                                                            .courses_scraped
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Assignments Found
                                                </p>
                                                <p className="font-semibold">
                                                    {
                                                        status.result
                                                            .assignments_found
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Due Dates Found
                                                </p>
                                                <p className="font-semibold">
                                                    {
                                                        status.result
                                                            .due_dates_found
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Duration
                                                </p>
                                                <p className="font-semibold">
                                                    {status.result.duration_seconds.toFixed(
                                                        2
                                                    )}
                                                    s
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
