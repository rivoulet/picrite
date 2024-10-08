import "./Grid.less";

import { Dispatch, Ref, useRef } from "react";

import { CellValue } from "src/CellValue";
import { useScrollShadows } from "src/components/scroll-shadows/useScrollShadows";
import { useRefs } from "src/utils/useRefs";

import { SelectionOrNull, SetSelectionAction } from "./Selection";
import {
    useRows,
    useSelection,
    useSelectionInput,
    useSelectionTouchInput,
} from "./hooks";

function triggerOnScroll(
    onScroll: ((x: number, y: number) => void) | undefined,
    e: HTMLElement,
) {
    if (onScroll) {
        onScroll(e.scrollLeft, e.scrollTop);
    }
}

export interface GridProps {
    width: number;
    height: number;
    cells: CellValue[];
    className?: string | undefined;
    tabIndex?: number | undefined;
    scrollContainerTabIndex?: number | undefined;
    onScroll?: (x: number, y: number) => void | undefined;
    tableRef?: Ref<HTMLTableElement> | undefined;
    scrollContainerRef?: Ref<HTMLDivElement> | undefined;
}

export function Grid({
    width,
    height,
    cells,
    className = "",
    tabIndex,
    scrollContainerTabIndex,
    onScroll,
    tableRef,
    scrollContainerRef,
}: GridProps) {
    const rows = useRows(width, height, cells);

    const scrollContainerRef_ = useRef<HTMLDivElement>(null);
    const { shadows, update: updateShadows } =
        useScrollShadows(scrollContainerRef_);

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            <div
                className="grid__scroll-container"
                tabIndex={scrollContainerTabIndex}
                ref={useRefs(scrollContainerRef, scrollContainerRef_)}
                onScroll={(e) => {
                    updateShadows();
                    triggerOnScroll(onScroll, e.target as HTMLElement);
                }}
            >
                <table
                    className="grid__table"
                    tabIndex={tabIndex}
                    ref={tableRef}
                >
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export interface SelectableGridProps extends GridProps {
    selection: SelectionOrNull;
}

export function SelectableGrid({
    width,
    height,
    cells,
    selection,
    className = "",
    tabIndex,
    scrollContainerTabIndex,
    onScroll,
    tableRef,
    scrollContainerRef,
}: SelectableGridProps) {
    const rows = useRows(width, height, cells);

    const scrollContainerRef_ = useRef<HTMLDivElement>(null);
    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef_,
        "grid__scroll-shadows",
    );

    const { selectionElement, onScroll: selectionOnScroll } = useSelection(
        width,
        selection,
        scrollContainerRef_,
    );

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container"
                tabIndex={scrollContainerTabIndex}
                ref={useRefs(scrollContainerRef, scrollContainerRef_)}
                onScroll={(e) => {
                    updateShadows();
                    selectionOnScroll(e.target as HTMLElement);
                    triggerOnScroll(onScroll, e.target as HTMLElement);
                }}
            >
                <table
                    className="grid__table"
                    tabIndex={tabIndex}
                    ref={tableRef}
                >
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export interface SelectableGridWithInputProps extends SelectableGridProps {
    setSelection: Dispatch<SetSelectionAction>;
    autoFocus?: boolean | undefined;
}

export function SelectableGridWithInput({
    width,
    height,
    cells,
    selection,
    setSelection,
    autoFocus = false,
    className = "",
    tabIndex,
    scrollContainerTabIndex,
    onScroll,
    tableRef,
    scrollContainerRef,
}: SelectableGridWithInputProps) {
    const rows = useRows(width, height, cells);

    const scrollContainerRef_ = useRef<HTMLDivElement>(null);
    const tableRef_ = useRef<HTMLTableElement>(null);

    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef_,
        "grid__scroll-shadows",
    );

    const { selectionElement, onScroll: selectionOnScroll } = useSelection(
        width,
        selection,
        scrollContainerRef_,
    );
    const {
        onKeyDown: selectionOnKeyDown,
        onMouseDown: selectionOnMouseDown,
        onMouseMove: selectionOnMouseMove,
    } = useSelectionInput(width, height, selection, setSelection, tableRef_);

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container"
                tabIndex={scrollContainerTabIndex}
                ref={useRefs(scrollContainerRef, scrollContainerRef_)}
                onScroll={(e) => {
                    updateShadows();
                    selectionOnScroll(e.target as HTMLElement);
                    triggerOnScroll(onScroll, e.target as HTMLElement);
                }}
            >
                <table
                    className="grid__table"
                    tabIndex={tabIndex}
                    autoFocus={autoFocus}
                    onKeyDown={selectionOnKeyDown}
                    onMouseDown={selectionOnMouseDown}
                    onMouseMove={selectionOnMouseMove}
                    ref={useRefs(tableRef, tableRef_)}
                >
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export function SelectableGridWithTouchInput({
    width,
    height,
    cells,
    selection,
    setSelection,
    autoFocus = false,
    className = "",
    tabIndex,
    scrollContainerTabIndex,
    onScroll,
    tableRef,
    scrollContainerRef,
}: SelectableGridWithInputProps) {
    const rows = useRows(width, height, cells);

    const scrollContainerRef_ = useRef<HTMLDivElement>(null);
    const tableRef_ = useRef<HTMLTableElement>(null);

    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef_,
        "grid__scroll-shadows",
    );

    const { selectionElement, onScroll: selectionOnScroll } = useSelection(
        width,
        selection,
        scrollContainerRef_,
    );
    const {
        onKeyDown: selectionOnKeyDown,
        onMouseDown: selectionOnMouseDown,
        onMouseMove: selectionOnMouseMove,
        onPointerDown,
        onPointerDrag,
    } = useSelectionInput(width, height, selection, setSelection, tableRef_);
    const {
        onTouchStart: selectionOnTouchStart,
        onTouchMove: selectionOnTouchMove,
    } = useSelectionTouchInput(onPointerDown, onPointerDrag, tableRef_);

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container grid__scroll-container--touch-input"
                tabIndex={scrollContainerTabIndex}
                ref={useRefs(scrollContainerRef, scrollContainerRef_)}
                onScroll={(e) => {
                    updateShadows();
                    selectionOnScroll(e.target as HTMLElement);
                    triggerOnScroll(onScroll, e.target as HTMLElement);
                }}
            >
                <table
                    className="grid__table"
                    tabIndex={tabIndex}
                    autoFocus={autoFocus}
                    onKeyDown={selectionOnKeyDown}
                    onMouseDown={selectionOnMouseDown}
                    onMouseMove={selectionOnMouseMove}
                    onTouchStart={selectionOnTouchStart}
                    onTouchMove={selectionOnTouchMove}
                    ref={useRefs(tableRef, tableRef_)}
                >
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}
