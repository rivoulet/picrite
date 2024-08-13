import { memo } from "react";
import { CellMark } from "../../CellMark";
import { equalArrays } from "../../utils";

export interface LineProps {
    levelLine: number[];
    marks?: CellMark[] | undefined;
    isSelected: boolean;
}

export function Line({ levelLine, marks, isSelected }: LineProps) {
    const levelLineOr0 = levelLine.length ? levelLine : [0];

    return (
        <ol
            className={
                "numbers__line" + (isSelected ? " numbers__line--selected" : "")
            }
        >
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

export const MemoLine = memo(
    Line,
    (prevProps, nextProps) =>
        equalArrays(prevProps.levelLine, nextProps.levelLine) &&
        (prevProps.marks
            ? !!nextProps.marks && equalArrays(prevProps.marks, nextProps.marks)
            : !nextProps.marks) &&
        prevProps.isSelected === nextProps.isSelected
);
