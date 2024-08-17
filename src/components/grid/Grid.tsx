import "./Grid.less";

import { Dispatch, Ref, UIEvent, useCallback, useRef } from "react";
import { CellMark } from "../../CellMark";
import { useScrollShadows } from "../scroll-shadows/useScrollShadows";
import {
    useRows,
    useSelection,
    useSelectionInput,
    useSelectionTouchInput,
} from "./hooks";
import { SelectionOrNull, SetSelectionAction } from "./Selection";
import { useRefs } from "../../utils/useRefs";

function triggerOnScroll(
    onScroll: ((x: number, y: number) => void) | undefined,
    e: HTMLElement
) {
    if (onScroll) {
        onScroll(e.scrollLeft, e.scrollTop);
    }
}

export interface GridProps {
    width: number;
    height: number;
    marks: CellMark[];
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
    marks,
    className = "",
    tabIndex,
    scrollContainerTabIndex,
    onScroll,
    tableRef,
    scrollContainerRef,
}: GridProps) {
    const rows = useRows(width, height, marks);

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
                onScroll={useCallback(
                    (e: UIEvent) => {
                        updateShadows();
                        triggerOnScroll(onScroll, e.target as HTMLElement);
                    },
                    [updateShadows, onScroll]
                )}
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
    marks,
    selection,
    className = "",
    tabIndex,
    scrollContainerTabIndex,
    onScroll,
    tableRef,
    scrollContainerRef,
}: SelectableGridProps) {
    const rows = useRows(width, height, marks);

    const scrollContainerRef_ = useRef<HTMLDivElement>(null);
    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef_,
        "grid__scroll-shadows"
    );

    const { selectionElement, onScroll: selectionOnScroll } = useSelection(
        width,
        selection,
        scrollContainerRef_
    );

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container"
                tabIndex={scrollContainerTabIndex}
                ref={useRefs(scrollContainerRef, scrollContainerRef_)}
                onScroll={useCallback(
                    (e: UIEvent) => {
                        updateShadows();
                        selectionOnScroll(e.target as HTMLElement);
                        triggerOnScroll(onScroll, e.target as HTMLElement);
                    },
                    [updateShadows, selectionOnScroll, onScroll]
                )}
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
    marks,
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
    const rows = useRows(width, height, marks);

    const scrollContainerRef_ = useRef<HTMLDivElement>(null);
    const tableRef_ = useRef<HTMLTableElement>(null);

    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef_,
        "grid__scroll-shadows"
    );

    const { selectionElement, onScroll: selectionOnScroll } = useSelection(
        width,
        selection,
        scrollContainerRef_
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
                onScroll={useCallback(
                    (e: UIEvent) => {
                        updateShadows();
                        selectionOnScroll(e.target as HTMLElement);
                        triggerOnScroll(onScroll, e.target as HTMLElement);
                    },
                    [updateShadows, selectionOnScroll, onScroll]
                )}
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
    marks,
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
    const rows = useRows(width, height, marks);

    const scrollContainerRef_ = useRef<HTMLDivElement>(null);
    const tableRef_ = useRef<HTMLTableElement>(null);

    const { shadows, update: updateShadows } = useScrollShadows(
        scrollContainerRef_,
        "grid__scroll-shadows"
    );

    const { selectionElement, onScroll: selectionOnScroll } = useSelection(
        width,
        selection,
        scrollContainerRef_
    );
    const {
        onKeyDown: selectionOnKeyDown,
        onMouseDown: selectionOnMouseDown,
        onMouseMove: selectionOnMouseMove,
    } = useSelectionInput(width, height, selection, setSelection, tableRef_);
    const {
        onTouchStart: selectionOnTouchStart,
        onTouchMove: selectionOnTouchMove,
    } = useSelectionTouchInput(width, height, setSelection, tableRef_);

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container grid__scroll-container--touch-input"
                tabIndex={scrollContainerTabIndex}
                ref={useRefs(scrollContainerRef, scrollContainerRef_)}
                onScroll={useCallback(
                    (e: UIEvent) => {
                        updateShadows();
                        selectionOnScroll(e.target as HTMLElement);
                        triggerOnScroll(onScroll, e.target as HTMLElement);
                    },
                    [updateShadows, selectionOnScroll, onScroll]
                )}
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
