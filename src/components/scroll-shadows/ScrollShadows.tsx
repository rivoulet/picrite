import "./ScrollShadows.less";

import { memo } from "react";

export interface ScrollShadowsProps {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    className: string;
}

export const ScrollShadows = memo(
    ({ top, bottom, left, right, className = "" }: ScrollShadowsProps) => {
        return (
            <div className={className + " scroll-shadows"}>
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
);
