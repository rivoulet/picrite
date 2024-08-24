import { MutableRefObject, useCallback, useRef } from "react";

interface SyncedScrollElement<T> {
    current: T | null;
    scrollWasWritten: boolean;
}

// The length must be constant
export function useSyncedScroll<T extends HTMLElement>(length: number) {
    const elementsRef = useRef<SyncedScrollElement<T>[] | null>(
        null,
    ) as MutableRefObject<SyncedScrollElement<T>[]>;
    if (elementsRef.current === null) {
        const elements = new Array<SyncedScrollElement<T>>(length);
        for (let i = 0; i < length; i++) {
            elements[i] = { current: null, scrollWasWritten: false };
        }
        elementsRef.current = elements;
    }

    return {
        elementsRef,
        wasScrolledByUser: useCallback((i: number) => {
            const element = elementsRef.current[i];
            if (element.scrollWasWritten) {
                element.scrollWasWritten = false;
                return false;
            }
            return true;
        }, []),
        scroll: useCallback((i: number, x: number, isVertical: boolean) => {
            const element = elementsRef.current[i];
            if (!element.current) return;
            element.scrollWasWritten = true;
            if (isVertical) {
                element.current.scrollTop = x;
            } else {
                element.current.scrollLeft = x;
            }
        }, []),
    };
}
