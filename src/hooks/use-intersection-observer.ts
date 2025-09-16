// use-intersection-observer.tsx (utility hook)
import { useEffect, useRef, useState } from "react";

interface IntersectionObserverOptions {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
}

export function useIntersectionObserver(
    elementRef: React.RefObject<Element | null>,
    options: IntersectionObserverOptions = {}
) {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();

    useEffect(() => {
        const node = elementRef?.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => setEntry(entry),
            {
                threshold: options.threshold ?? 0.1,
                root: null,
                rootMargin: options.rootMargin ?? "0px",
            }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [elementRef, options.threshold, options.root, options.rootMargin]);

    return entry;
}
