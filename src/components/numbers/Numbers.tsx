import "./Numbers.less";

import { Ref, memo } from "react";

import { CellMark } from "src/CellValue";
import { LevelNumbers, LevelSize } from "src/Level";
import { cellValuesByLine } from "src/algorithms/utils";

import { Line } from "./Line";

export interface NumbersProps {
    isVertical: boolean;
    level: LevelNumbers;
    selection: number;
    className?: string | undefined;
    tabIndex?: number | undefined;
    onScroll?: (x: number) => void | undefined;
    innerRef?: Ref<HTMLOListElement> | undefined;
}

export interface NumbersPropsWithMarks extends NumbersProps {
    level: LevelSize & LevelNumbers;
    marks: CellMark[];
}

export const Numbers = memo((props: NumbersProps | NumbersPropsWithMarks) => {
    const { isVertical, className = "", tabIndex, onScroll, innerRef } = props;

    const marksByLine_ =
        "marks" in props
            ? cellValuesByLine(props.level, props.marks, props.isVertical)
            : undefined;
    const numberLines = (
        props.isVertical ? props.level.vNumbers : props.level.hNumbers
    ).map((numbers, i) => {
        return (
            <Line
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
            {numberLines}
        </ol>
    );
});
