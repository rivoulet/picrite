import "./Numbers.less";

import { ForwardedRef, memo, UIEvent, useCallback } from "react";
import { LevelDimensions, LoadedLevelLines } from "../../Level";
import { CellMark } from "../../CellMark";
import { lineMarks } from "../../algorithms/utils";
import { MemoLine } from "./Line";

export interface NumbersProps {
    isVertical: boolean;
    level: LoadedLevelLines;
    selection: number;
    className?: string;
    onScroll?: (x: number) => void;
    innerRef?: ForwardedRef<HTMLOListElement>;
}

export interface NumbersPropsWithMarks extends NumbersProps {
    level: LoadedLevelLines & LevelDimensions;
    marks: CellMark[];
}

export function Numbers(props: NumbersProps | NumbersPropsWithMarks) {
    const { isVertical, className = "", onScroll, innerRef } = props;

    const lineMarks_ =
        "marks" in props
            ? lineMarks(props.level, props.marks, props.isVertical)
            : undefined;
    const numberLines = (
        props.isVertical ? props.level.vLines : props.level.hLines
    ).map((levelLine, i) => {
        return (
            <MemoLine
                key={i}
                levelLine={levelLine}
                marks={lineMarks_ ? lineMarks_[i] : undefined}
                isSelected={props.selection === i}
            />
        );
    });

    return (
        <ol
            className={
                className +
                " numbers " +
                (isVertical ? "numbers--v" : "numbers--h")
            }
            onScroll={useCallback(
                (e: UIEvent) => {
                    if (onScroll) {
                        const target = e.target as HTMLOListElement;
                        onScroll(
                            isVertical ? target.scrollLeft : target.scrollTop
                        );
                    }
                },
                [isVertical, onScroll]
            )}
            tabIndex={-1}
            ref={innerRef}
        >
            {...numberLines}
        </ol>
    );
}

export const NumbersMemo = memo(Numbers);
