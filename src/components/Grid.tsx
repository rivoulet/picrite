import { memo, ReactElement, useMemo, useRef } from "react";
import "./Grid.less";
import { CellMark } from "../CellMark";
import CrossSign from "../assets/cross.svg?react";
import { useScrollShadows } from "./ScrollShadows";

function Cell({ mark }: { mark: CellMark }) {
    const hasMarkRef = useRef(true);
    const hasVisibleMark = mark != CellMark.Empty;
    if (hasVisibleMark) {
        hasMarkRef.current = mark == CellMark.Mark;
    }
    const hasVisibleMarkClassName = hasVisibleMark
        ? " grid__table__cell__contents--visible"
        : "";
    return (
        <td className="grid__table__cell">
            {hasMarkRef.current ? (
                <div
                    className={
                        " grid__table__cell__contents grid__table__cell__contents--mark" +
                        hasVisibleMarkClassName
                    }
                />
            ) : (
                <CrossSign
                    className={
                        " grid__table__cell__contents grid__table__cell__contents--cross" +
                        hasVisibleMarkClassName
                    }
                />
            )}
        </td>
    );
}

const MemoCell = memo(Cell);

function useRows(width: number, height: number, marks: CellMark[]) {
    return useMemo(() => {
        const rows = new Array<ReactElement>(height);
        for (let y = 0; y < height; y++) {
            const row = new Array<ReactElement>(width);
            for (let x = 0; x < width; x++) {
                row[x] = <MemoCell key={x} mark={marks[y * width + x]} />;
            }
            rows[y] = <tr key={y}>{...row}</tr>;
        }
        return rows;
    }, [width, height, marks]);
}

export function Grid({
    width,
    height,
    marks,
    className = "",
}: {
    width: number;
    height: number;
    marks: CellMark[];
    className?: string;
}) {
    const rows = useRows(width, height, marks);

    return (
        <div className={className}>
            <table className="grid__table">
                <tbody>{...rows}</tbody>
            </table>
        </div>
    );
}

export function ScrollableGrid({
    width,
    height,
    marks,
    className = "",
}: {
    width: number;
    height: number;
    marks: CellMark[];
    className?: string;
}) {
    const rows = useMemo(() => {
        const rows = new Array(height);
        for (let y = 0; y < height; y++) {
            const row = new Array(width);
            for (let x = 0; x < width; x++) {
                row[x] = <MemoCell key={x} mark={marks[y * width + x]} />;
            }
            rows[y] = <tr key={y}>{...row}</tr>;
        }
        return rows;
    }, [width, height, marks]);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const { shadows, update: updateShadows } =
        useScrollShadows(scrollContainerRef);

    return (
        <div className={"grid--scrollable " + className}>
            {shadows}
            <div
                className="grid__scroll-container"
                ref={scrollContainerRef}
                onScroll={updateShadows}
            >
                <table className="grid__table">
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}
