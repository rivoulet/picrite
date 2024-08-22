import { MutableRefObject, useEffect, useRef, useState } from "react";

interface State {
    baseTime: number;
    baseElapsed: number;
    isPaused: boolean;
}

export function useTimer(isPaused: boolean) {
    const [elapsed, setElapsed] = useState(0);

    const state = useRef<State | null>(null) as MutableRefObject<State>;
    if (state.current === null || (state.current.isPaused && !isPaused)) {
        state.current = {
            baseTime: Date.now(),
            baseElapsed: elapsed,
            isPaused,
        };
    } else {
        state.current.isPaused = isPaused;
    }

    useEffect(() => {
        const update = () => {
            if (!state.current.isPaused) {
                const now = Date.now();
                setElapsed(
                    state.current.baseElapsed +
                        (now - state.current.baseTime) / 1000
                );
            }
            if (update.shouldStop) return;
            requestAnimationFrame(update);
        };
        update.shouldStop = false;
        requestAnimationFrame(update);
        return () => {
            update.shouldStop = true;
        };
    }, []);

    return elapsed;
}
