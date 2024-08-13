import { useCallback, useEffect, useState } from "react";
import { ScrollShadowsMemo } from "./ScrollShadows";

export function useScrollShadows(
    ref: React.MutableRefObject<HTMLElement | null>,
    className: string = ""
) {
    const [top, setTop] = useState(false);
    const [bottom, setBottom] = useState(false);
    const [left, setLeft] = useState(false);
    const [right, setRight] = useState(false);

    const update = useCallback(() => {
        const e = ref.current;
        if (!e) {
            return;
        }
        setTop(e.scrollTop > 0);
        setBottom(e.scrollTop < e.scrollHeight - e.clientHeight - 1);
        setLeft(e.scrollLeft > 0);
        setRight(e.scrollLeft < e.scrollWidth - e.clientWidth - 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [update]);

    return {
        shadows: (
            <ScrollShadowsMemo
                top={top}
                bottom={bottom}
                left={left}
                right={right}
                className={className}
            />
        ),
        update,
    };
}
