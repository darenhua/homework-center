import { AssignmentDetails } from "@/components/assignment/assignment-list";
import type { AssignmentDetailsProps } from "@/components/assignment/assignment-list";

export interface DayItem extends AssignmentDetailsProps {
    id: string;
}

interface DayProps {
    date: Date;
    items: DayItem[];
    isToday?: boolean;
    isTomorrow?: boolean;
}

export function Day({ date, items, isToday, isTomorrow }: DayProps) {
    const formatDate = (date: Date) => {
        const month = date.toLocaleDateString("en-US", { month: "short" });
        const day = date.getDate();
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

        let dateLabel = `${month} ${day}`;
        if (isToday) {
            dateLabel += " - Today";
        } else if (isTomorrow) {
            dateLabel += " - Tomorrow";
        }
        dateLabel += ` - ${dayOfWeek}`;

        return dateLabel;
    };

    return (
        <div className="border-2 border-black dark:border-white rounded-lg p-4 mb-4 dark:bg-gray-900 border-none bg-transparent">
            <div className="border-b-2 border-black dark:border-white pb-2 mb-4">
                <h2 className="text-lg font-bold text-black dark:text-white">
                    {formatDate(date)}
                </h2>
            </div>

            <div className="space-y-2">
                {items.map((item, index) => (
                    <AssignmentDetails
                        key={item.id}
                        title={item.title}
                        number={index + 1}
                        color={item.color}
                        date={item.date}
                        url={item.url}
                        description={item.description}
                    />
                ))}
            </div>
        </div>
    );
}
