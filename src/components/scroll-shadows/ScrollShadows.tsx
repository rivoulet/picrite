import "./ScrollShadows.less";

import { memo } from "react";

export function ScrollShadows({
    top,
    bottom,
    left,
    right,
    className = "",
}: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    className: string;
}) {
    return (
        <div className={"scroll-shadows " + className}>
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

export const ScrollShadowsMemo = memo(ScrollShadows);
