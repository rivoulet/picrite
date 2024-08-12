import "../grid/Grid.less";
import "./PlayGrid.less";

import { useCallback, useRef } from "react";
import { SelectableGridWithInputProps } from "../grid/Grid";
import { useScrollShadows } from "../scroll-shadows/useScrollShadows";
import { useRows, useSelection, useSelectionInput } from "../grid/hooks";
import { useSelectionTouchInput } from "./hooks";

export function PlayGrid({
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
    const {
        onTouchStart: selectionOnTouchStart,
        onTouchMove: selectionOnTouchMove,
        onTouchEnd: selectionOnTouchEnd,
    } = useSelectionTouchInput(width, height, setSelection, tableRef);

    return (
        <div className={"grid--scrollable " + className}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container grid__scroll-container--"
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
                    onTouchStart={selectionOnTouchStart}
                    onTouchMove={selectionOnTouchMove}
                    onTouchEnd={selectionOnTouchEnd}
                    ref={tableRef}
                >
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}
