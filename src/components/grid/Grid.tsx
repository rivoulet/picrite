import "./Grid.less";

import { memo, useCallback, useRef } from "react";
import { CellMark } from "../../CellMark";
import CrossSign from "../../assets/cross.svg?react";
import { useScrollShadows } from "../scroll-shadows/useScrollShadows";
import { useRows, useSelection } from "./hooks";

export function Cell({ mark }: { mark: CellMark }) {
    const hasMarkRef = useRef(true);
    const hasVisibleMark = mark != CellMark.Empty;
    if (hasVisibleMark) {
        hasMarkRef.current = mark == CellMark.Mark;
    }
    const hasVisibleMarkClassName = hasVisibleMark
        ? " grid__cell__contents--visible"
        : "";
    return (
        <td className="grid__cell">
            {hasMarkRef.current ? (
                <div
                    className={
                        " grid__cell__contents grid__cell__contents--mark" +
                        hasVisibleMarkClassName
                    }
                />
            ) : (
                <CrossSign
                    className={
                        " grid__cell__contents grid__cell__contents--cross" +
                        hasVisibleMarkClassName
                    }
                />
            )}
        </td>
    );
}

export const MemoCell = memo(Cell);

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
    const rows = useRows(width, height, marks);

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

export function SelectableGrid({
    width,
    height,
    marks,
    selection,
    className = "",
}: {
    width: number;
    height: number;
    marks: CellMark[];
    selection: [number, number] | null;
    className?: string;
}) {
    const rows = useRows(width, height, marks);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef,
        "grid__scroll-shadows"
    );

    const { selectionElement, onScroll: updateSelectionScroll } = useSelection(
        width,
        selection,
        scrollContainerRef
    );

    return (
        <div className={"grid--scrollable " + className}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container"
                ref={scrollContainerRef}
                onScroll={useCallback(() => {
                    updateShadows();
                    updateSelectionScroll();
                }, [updateShadows, updateSelectionScroll])}
            >
                <table className="grid__table">
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}
