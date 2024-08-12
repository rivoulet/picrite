import "./Numbers.less";

import { ForwardedRef, memo } from "react";
import { LevelDimensions, LoadedLevelLines } from "../../Level";
import { CellMark } from "../../CellMark";
import { lineMarks } from "../../algorithms/utils";
import { equalArrays } from "../../utils";

interface LineProps {
    levelLine: number[];
    marks?: CellMark[] | undefined;
}

function Line({ levelLine, marks }: LineProps) {
    const levelLineOr0 = levelLine.length ? levelLine : [0];

    return (
        <ol className={"numbers__line"}>
            {...levelLineOr0.map((n, i) => {
                return (
                    <li key={i} className={"numbers__line__number"}>
                        {n}
                    </li>
                );
            })}
        </ol>
    );
}

const MemoLine = memo(
    Line,
    (prevProps, nextProps) =>
        equalArrays(prevProps.levelLine, nextProps.levelLine) &&
        (prevProps.marks
            ? !!nextProps.marks && equalArrays(prevProps.marks, nextProps.marks)
            : !nextProps.marks)
);

export interface NumbersProps {
    isVertical: boolean;
    level: LoadedLevelLines;
    onScroll?: (x: number) => void;
    ref?: ForwardedRef<HTMLOListElement>;
    className?: string;
}

export interface NumbersPropsWithMarks extends NumbersProps {
    level: LoadedLevelLines & LevelDimensions;
    marks: CellMark[];
}

export function Numbers(props: NumbersProps | NumbersPropsWithMarks) {
    const { isVertical, level, onScroll, ref, className = "" } = props;
    const lineMarks_ =
        "marks" in props
            ? lineMarks(props.level, props.marks, isVertical)
            : undefined;
    const numberLines = (isVertical ? level.vLines : level.hLines).map(
        (levelLine, i) => {
            return (
                <MemoLine
                    key={i}
                    levelLine={levelLine}
                    marks={lineMarks_ ? lineMarks_[i] : undefined}
                />
            );
        }
    );

    return (
        <ol
            className={
                className +
                " numbers " +
                (isVertical ? "numbers--v" : "numbers--h")
            }
            onScroll={
                onScroll
                    ? (e) => {
                          const target = e.target as HTMLOListElement;
                          onScroll(
                              isVertical ? target.scrollLeft : target.scrollTop
                          );
                      }
                    : undefined
            }
            tabIndex={-1}
            ref={ref}
        >
            {...numberLines}
        </ol>
    );
}

export const NumbersMemo = memo(Numbers);
