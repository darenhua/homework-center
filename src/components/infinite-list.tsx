"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InfiniteListProps<T> {
    queryKey: string[];
    fetchFn: (page: number) => Promise<{ data: T[]; hasMore: boolean }>;
    renderItem: (item: T, index: number) => React.ReactNode;
    pageSize?: number;
    className?: string;
    scrollContainer?: React.RefObject<HTMLDivElement>;
}

export function InfiniteList<T>({
    queryKey,
    fetchFn,
    renderItem,
    pageSize = 20,
    className,
    scrollContainer,
}: InfiniteListProps<T>) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteQuery({
            queryKey,
            queryFn: ({ pageParam = 0 }) => fetchFn(pageParam),
            getNextPageParam: (lastPage, pages) => {
                return lastPage.hasMore ? pages.length : undefined;
            },
            initialPageParam: 0,
        });

    const loadMoreRef = React.useRef<HTMLDivElement>(null);

    const entry = useIntersectionObserver(loadMoreRef, {
        root: scrollContainer?.current ?? null,
        threshold: 0,
        rootMargin: "100px",
    });
    const isVisible = !!entry?.isIntersecting;

    React.useEffect(() => {
        console.log(isVisible);
        if (isVisible && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const items = data?.pages.flatMap((page) => page.data) ?? [];

    if (isLoading) {
        return (
            <div className={cn("space-y-2", className)}>
                {Array.from({ length: pageSize }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className={cn("space-y-2", className)}>
            {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No items found
                </div>
            ) : (
                items.map((item, index) => renderItem(item, index))
            )}

            <div
                ref={loadMoreRef}
                className="h-20 w-full flex items-center justify-center"
            >
                {hasNextPage && !isFetchingNextPage && (
                    <div className="text-sm text-muted-foreground">
                        Loading more...
                    </div>
                )}
            </div>

            {isFetchingNextPage && (
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            )}

            {!hasNextPage && items.length > 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                    End of list
                </div>
            )}
        </div>
    );
}
