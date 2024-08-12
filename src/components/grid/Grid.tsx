import "./Grid.less";

import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { CellMark } from "../../CellMark";
import { useScrollShadows } from "../scroll-shadows/useScrollShadows";
import { useRows, useSelection, useSelectionInput } from "./hooks";

export interface GridProps {
    width: number;
    height: number;
    marks: CellMark[];
    className?: string;
}

export function Grid({ width, height, marks, className = "" }: GridProps) {
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
}: GridProps) {
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

export interface SelectableGridProps extends GridProps {
    selection: [number, number] | null;
}

export function SelectableGrid({
    width,
    height,
    marks,
    selection,
    className = "",
}: SelectableGridProps) {
    const rows = useRows(width, height, marks);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef,
        "grid__scroll-shadows"
    );

    const { selectionElement, onScroll: selectionOnScroll } = useSelection(
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
                    selectionOnScroll();
                }, [updateShadows, selectionOnScroll])}
            >
                <table className="grid__table">
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export interface SelectableGridWithInputProps extends SelectableGridProps {
    setSelection: Dispatch<SetStateAction<[number, number] | null>>;
    autoFocus?: boolean;
}

export function SelectableGridWithInput({
    width,
    height,
    marks,
    selection,
    setSelection,
    autoFocus = false,
    className = "",
}: SelectableGridWithInputProps) {
    const rows = useRows(width, height, marks);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const tableRef = useRef<HTMLTableElement | null>(null);

    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef,
        "grid__scroll-shadows"
    );

    const { selectionElement, onScroll: selectionOnScroll } = useSelection(
        width,
        selection,
        scrollContainerRef
    );
    const {
        onKeyDown: selectionOnKeyDown,
        onMouseDown: selectionOnMouseDown,
        onMouseMove: selectionOnMouseMove,
    } = useSelectionInput(width, height, selection, setSelection, tableRef);

    return (
        <div className={"grid--scrollable " + className}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container"
                ref={scrollContainerRef}
                onScroll={useCallback(() => {
                    updateShadows();
                    selectionOnScroll();
                }, [updateShadows, selectionOnScroll])}
            >
                <table
                    className="grid__table"
                    tabIndex={0}
                    autoFocus={autoFocus}
                    onKeyDown={selectionOnKeyDown}
                    onMouseDown={selectionOnMouseDown}
                    onMouseMove={selectionOnMouseMove}
                    ref={tableRef}
                >
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}
