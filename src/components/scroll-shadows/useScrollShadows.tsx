import { RefObject, useCallback, useEffect, useRef, useState } from "react";

import { ScrollShadows } from "./ScrollShadows";

export function useScrollShadows(
    ref: RefObject<HTMLElement>,
    className: string = "",
) {
    const [, setCurUpdate] = useState(0);

    const visibleDirections = useCallback(() => {
        const e = ref.current;
        if (!e) return { top: false, bottom: false, left: false, right: false };
        return {
            top: e.scrollTop > 0,
            bottom: e.scrollTop < e.scrollHeight - e.clientHeight - 1,
            left: e.scrollLeft > 0,
            right: e.scrollLeft < e.scrollWidth - e.clientWidth - 1,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const directions = visibleDirections();
    const directionsRef = useRef(directions);
    directionsRef.current = directions;

    const update = useCallback(() => {
        const newDirections = visibleDirections();
        const directionsAreIdentical =
            newDirections.top === directionsRef.current.top &&
            newDirections.bottom === directionsRef.current.bottom &&
            newDirections.left === directionsRef.current.left &&
            newDirections.right === directionsRef.current.right;
        if (directionsAreIdentical) return;
        setCurUpdate((update) => (update + 1) & 0xff);
    }, [visibleDirections]);

    useEffect(() => {
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [update]);

    return {
        shadows: (
            <ScrollShadows
                top={directionsRef.current.top}
                bottom={directionsRef.current.bottom}
                left={directionsRef.current.left}
                right={directionsRef.current.right}
                className={className}
            />
        ),
        update,
    };
}
