import "./ScrollShadows.less";

import { memo, useCallback, useEffect, useState } from "react";

export function ScrollShadows({
    top,
    bottom,
    left,
    right,
}: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}) {
    return (
        <div className="scroll-shadows">
            <div
                className={
                    "scroll-shadows__side scroll-shadows__side--top" +
                    (top ? " scroll-shadows__side--enabled" : "")
                }
            />
            <div
                className={
                    "scroll-shadows__side scroll-shadows__side--bottom" +
                    (bottom ? " scroll-shadows__side--enabled" : "")
                }
            />
            <div
                className={
                    "scroll-shadows__side scroll-shadows__side--left" +
                    (left ? " scroll-shadows__side--enabled" : "")
                }
            />
            <div
                className={
                    "scroll-shadows__side scroll-shadows__side--right" +
                    (right ? " scroll-shadows__side--enabled" : "")
                }
            />
        </div>
    );
}

const ScrollShadowsMemo = memo(ScrollShadows);

// eslint-disable-next-line react-refresh/only-export-components
export function useScrollShadows(
    ref: React.MutableRefObject<HTMLElement | null>
) {
    const [top, setTop] = useState(false);
    const [bottom, setBottom] = useState(false);
    const [left, setLeft] = useState(false);
    const [right, setRight] = useState(false);

    const update = useCallback(() => {
        const e = ref.current!;
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
            />
        ),
        update,
    };
}
