import "./Numbers.less";

import { memo, Ref } from "react";
import { LevelDimensions, LoadedLevelNumbers } from "../../Level";
import { CellMark } from "../../CellMark";
import { marksByLine } from "../../algorithms/utils";
import { LineMemo } from "./Line";

export interface NumbersProps {
    isVertical: boolean;
    level: LoadedLevelNumbers;
    selection: number;
    className?: string | undefined;
    tabIndex?: number | undefined;
    onScroll?: (x: number) => void | undefined;
    innerRef?: Ref<HTMLOListElement> | undefined;
}

export interface NumbersPropsWithMarks extends NumbersProps {
    level: LoadedLevelNumbers & LevelDimensions;
    marks: CellMark[];
}

export function Numbers(props: NumbersProps | NumbersPropsWithMarks) {
    const { isVertical, className = "", tabIndex, onScroll, innerRef } = props;

    const marksByLine_ =
        "marks" in props
            ? marksByLine(props.level, props.marks, props.isVertical)
            : undefined;
    const numberLines = (
        props.isVertical ? props.level.vNumbers : props.level.hNumbers
    ).map((numbers, i) => {
        return (
            <LineMemo
                key={i}
                numbers={numbers}
                marks={marksByLine_ ? marksByLine_[i] : undefined}
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
            tabIndex={tabIndex}
            onScroll={(e) => {
                if (onScroll) {
                    const target = e.target as HTMLElement;
                    onScroll(isVertical ? target.scrollLeft : target.scrollTop);
                }
            }}
            ref={innerRef}
        >
            {...numberLines}
        </ol>
    );
}

export const NumbersMemo = memo(Numbers);
