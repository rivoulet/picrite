import {
    MouseEvent,
    TouchEvent as ReactTouchEvent,
    RefObject,
    useCallback,
    useEffect,
    useRef,
} from "react";

export function useMousePointer(
    onPointerDown: (offsetX: number, offsetY: number) => void,
    onPointerDrag: (offsetX: number, offsetY: number) => void,
    ref: RefObject<HTMLElement>,
) {
    const onMouseDown = (e: MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        onPointerDown(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!ref.current || !e.buttons) return;
        const rect = ref.current.getBoundingClientRect();
        onPointerDrag(e.clientX - rect.left, e.clientY - rect.top);
    };

    return {
        onMouseDown,
        onMouseMove,
    };
}

export function useTouchPointer(
    onPointerDown: (offsetX: number, offsetY: number) => void,
    onPointerDrag: (offsetX: number, offsetY: number) => void,
    ref: RefObject<HTMLElement>,
) {
    const touchesRef = useRef<number[]>([]);

    const onTouchStart = (e: ReactTouchEvent) => {
        let touch0;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            switch (touchesRef.current.indexOf(touch.identifier)) {
                case -1: {
                    if (touchesRef.current.length === 0) {
                        touch0 = touch;
                    }
                    touchesRef.current.push(touch.identifier);
                    break;
                }
                case 0: {
                    touch0 = touch;
                    break;
                }
                default:
                    break;
            }
        }
        if (!touch0 || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        onPointerDown(touch0.clientX - rect.left, touch0.clientY - rect.top);
    };

    const onTouchMove = (e: ReactTouchEvent) => {
        let touch0;
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touchesRef.current.indexOf(touch.identifier) === 0) {
                touch0 = touch;
            }
        }
        if (!touch0 || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        onPointerDrag(touch0.clientX - rect.left, touch0.clientY - rect.top);
    };

    const onTouchEnd = useCallback((e: TouchEvent) => {
        if (
            e.target instanceof HTMLElement &&
            ref.current?.contains(e.target)
        ) {
            e.preventDefault();
        }
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const j = touchesRef.current.indexOf(touch.identifier);
            if (j !== -1) {
                touchesRef.current.splice(j, 1);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("touchcancel", onTouchEnd);
        return () => {
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
        };
    }, [onTouchEnd]);

    return {
        onTouchStart,
        onTouchMove,
    };
}
