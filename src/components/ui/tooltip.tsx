"use client";

import type * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";
import type { SourceInfo } from "../footer";

function TooltipProvider({
    delayDuration = 0,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            {...props}
        />
    );
}

function Tooltip({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    );
}

function TooltipTrigger({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
    className,
    sideOffset = 0,
    children,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={cn(
                    "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
                    className
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

interface UrlStatusTooltipProps {
    title: string;
    urls: SourceInfo[];
    className?: string;
}

function UrlStatusTooltip({ title, urls, className }: UrlStatusTooltipProps) {
    return (
        <TooltipContent className={cn("w-48 p-3 mr-3", className)}>
            <div className="space-y-2">
                <h4 className="font-medium text-sm text-primary-foreground">
                    {title}
                </h4>
                <ul className="space-y-1.5">
                    {urls.map((url, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <div className="relative flex-shrink-0">
                                <div
                                    className={cn(
                                        "w-2 h-2 rounded-full",
                                        url.synced
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    )}
                                />
                                <div
                                    className={cn(
                                        "absolute inset-0 w-2 h-2 rounded-full animate-ping",
                                        url.synced
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    )}
                                />
                            </div>
                            <span className="text-xs text-primary-foreground truncate flex-1">
                                {url.url}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </TooltipContent>
    );
}

export {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
    UrlStatusTooltip,
};
