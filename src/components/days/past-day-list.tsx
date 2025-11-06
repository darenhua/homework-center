"use client";

import * as React from "react";
import { InfiniteList } from "../infinite-list";
import { Day, type DayItem } from "./day";

interface PastDayListProps {
    items: DayItem[];
    earliestDate?: Date; // The earliest date that has assignments
}

interface DayData {
    date: Date;
    items: DayItem[];
    isToday: boolean;
    isTomorrow: boolean;
}

export function PastDayList({ items, earliestDate }: PastDayListProps) {
    // Find the earliest date if not provided
    const getEarliestDate = () => {
        if (earliestDate) return earliestDate;
        
        if (items.length === 0) {
            // Default to 1 year ago if no items
            const date = new Date();
            date.setFullYear(date.getFullYear() - 1);
            return date;
        }

        // Find the earliest date from items
        const dates = items
            .map((item) => new Date(item.date + "T00:00:00"))
            .filter((date) => !isNaN(date.getTime()));
        
        if (dates.length === 0) {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 1);
            return date;
        }

        return new Date(Math.min(...dates.map((d) => d.getTime())));
    };

    const earliest = getEarliestDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Function to generate days going backwards from today
    const fetchDays = async (
        page: number
    ): Promise<{ data: DayData[]; hasMore: boolean }> => {
        const pageSize = 10;
        const days: DayData[] = [];

        // If no items, return empty immediately
        if (items.length === 0) {
            return {
                data: [],
                hasMore: false,
            };
        }

        for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() - i - 1); // -1 because we start from yesterday (day before today)

            // Check if we've reached the earliest date
            if (currentDate < earliest) {
                break;
            }

            // Filter items that belong to this day
            const dayItems = items.filter((item) => {
                const itemDate = new Date(item.date + "T00:00:00");
                itemDate.setHours(0, 0, 0, 0);
                return itemDate.getTime() === currentDate.getTime();
            });

            days.push({
                date: currentDate,
                items: dayItems,
                isToday: false, // Never true for past dates
                isTomorrow: false, // Never true for past dates
            });
        }

        // Check if there are more days to load
        const lastDate = days.length > 0 ? days[days.length - 1].date : today;
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() - 1);
        const hasMore = nextDate >= earliest && days.length === pageSize;

        return {
            data: days,
            hasMore,
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

    // Show empty state if no items
    if (items.length === 0) {
        return (
            <div className="h-full overflow-auto p-4 pt-10 flex justify-center items-center">
                <div className="max-w-[1000px] w-full text-center py-16">
                    <div className="text-lg font-semibold text-gray-700 mb-2 font-asul">
                        No past assignments
                    </div>
                    <div className="text-sm text-gray-500 font-asul">
                        You don't have any completed assignments yet.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={scrollContainerRef}
            className="h-full overflow-auto p-4 pt-10 flex justify-center"
        >
            <div className="max-w-[1000px] h-full w-full">
                <InfiniteList
                    queryKey={["past-days"]}
                    fetchFn={fetchDays}
                    renderItem={renderDay}
                    pageSize={10}
                    scrollContainer={scrollContainerRef}
                />
            </div>
        </div>
    );
}

