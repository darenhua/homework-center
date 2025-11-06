"use client";

import * as React from "react";
import { InfiniteList } from "../infinite-list";
import { Day, type DayItem } from "./day";

interface DayListProps {
    items: DayItem[];
}

interface DayData {
    date: Date;
    items: DayItem[];
    isToday: boolean;
    isTomorrow: boolean;
}

export function DayList({ items }: DayListProps) {
    // Function to generate days starting from today
    const fetchDays = async (
        page: number
    ): Promise<{ data: DayData[]; hasMore: boolean }> => {
        const pageSize = 10;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        const days: DayData[] = [];

        for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // Filter items that belong to this day
            const dayItems = items.filter((item) => {
                const itemDate = new Date(item.date + "T00:00:00"); // Add time to ensure proper parsing
                itemDate.setHours(0, 0, 0, 0);
                return itemDate.getTime() === currentDate.getTime();
            });

            days.push({
                date: currentDate,
                items: dayItems,
                isToday: i === 0,
                isTomorrow: i === 1,
            });
        }

        return {
            data: days,
            hasMore: true, // Always has more days for infinite scrolling
        };
    };

    const renderDay = (dayData: DayData, index: number) => (
        <Day
            key={`${dayData.date.getTime()}-${index}`}
            date={dayData.date}
            items={dayData.items}
            isToday={dayData.isToday}
            isTomorrow={dayData.isTomorrow}
        />
    );

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            ref={scrollContainerRef}
            className="h-full overflow-auto p-4 pt-10 flex justify-center"
        >
            <div className="max-w-[1000px] h-full w-full">
                <InfiniteList
                    queryKey={["days"]}
                    fetchFn={fetchDays}
                    renderItem={renderDay}
                    pageSize={10}
                    scrollContainer={scrollContainerRef}
                />
            </div>
        </div>
    );
}
