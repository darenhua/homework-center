"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Assignment } from "./assignment";

export interface AssignmentDetailsProps {
    title: string;
    number?: number;
    color?: string;
    date?: string;
    url?: string;
    description?: string;
}

export function AssignmentDetails({
    title,
    number,
    color = "bg-yellow-200",
    date = "Sep 10 - Wednesday",
}: AssignmentDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDate, setEditedDate] = useState(date);
    const [currentTitle, setCurrentTitle] = useState(title);
    const [currentDate, setCurrentDate] = useState(date);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );

    const handleSave = () => {
        setCurrentTitle(editedTitle);
        setCurrentDate(editedDate);
        setIsEditingMode(false);
    };

    const enterEditingMode = () => {
        setIsEditingMode(true);
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
        // Format date and update edited date
        if (date) {
            const formatted = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                weekday: "long",
            });
            setEditedDate(formatted);
        }
    };

    return (
        <>
            <Assignment
                title={currentTitle}
                number={number}
                color={color}
                onCardClick={() => setIsOpen(true)}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl p-0 bg-transparent border-none shadow-none">
                    {/* Modal content with same styling as assignment cards */}
                    <div
                        className={`${color} border-2 border-black rounded-3xl p-6 shadow-lg relative`}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-6 h-6 rounded-full border-2 border-black bg-white" />
                            <div className="flex-1 space-y-2">
                                {isEditingMode ? (
                                    <>
                                        <Input
                                            value={editedTitle}
                                            onChange={(e) =>
                                                setEditedTitle(e.target.value)
                                            }
                                            className="font-medium text-black bg-white border-2 border-black rounded-lg w-full focus:border-black"
                                            placeholder="Assignment title"
                                            autoFocus
                                        />
                                        <Popover
                                            open={isDatePickerOpen}
                                            onOpenChange={setIsDatePickerOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <div
                                                    className="text-sm font-medium text-black bg-white border-2 border-black rounded-lg w-full px-3 py-2 cursor-pointer hover:bg-gray-50"
                                                    onClick={() =>
                                                        setIsDatePickerOpen(
                                                            true
                                                        )
                                                    }
                                                >
                                                    {editedDate}
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                side="left"
                                                align="start"
                                            >
                                                <div className="p-4">
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={
                                                            handleDateSelect
                                                        }
                                                        className="rounded-md"
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <Button
                                            onClick={handleSave}
                                            className=" bg-green-400 hover:bg-green-500 text-black border-2 border-black rounded-xl px-4 py-2 font-medium"
                                        >
                                            Save
                                        </Button>
                                    </>
                                ) : (
                                    <h2
                                        className="text-xl font-medium text-black cursor-pointer hover:bg-black/5 px-2 py-1 rounded"
                                        onClick={enterEditingMode}
                                    >
                                        {currentTitle}
                                    </h2>
                                )}
                            </div>
                        </div>

                        {/* Details section */}
                        <div className="space-y-2 mb-6 ml-10">
                            {!isEditingMode && (
                                <p
                                    className="text-lg text-black cursor-pointer hover:bg-black/5 px-2 py-1 rounded inline-block"
                                    onClick={enterEditingMode}
                                >
                                    {currentDate}
                                </p>
                            )}
                            {/* <p className="text-lg text-black">{url}</p>
                        <p className="text-lg text-black">
                            description: {description}
                        </p> */}
                        </div>

                        {/* Content area - large rounded rectangle */}
                        <div className="bg-blue-300 border-3 border-black rounded-2xl h-64 p-4">
                            {/* This area can be used for additional content, attachments, etc. */}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
