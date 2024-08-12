import "./Grid.less";

import {
    Dispatch,
    ForwardedRef,
    MutableRefObject,
    SetStateAction,
    useCallback,
    useRef,
} from "react";
import { CellMark } from "../../CellMark";
import { useScrollShadows } from "../scroll-shadows/useScrollShadows";
import {
    useRows,
    useSelection,
    useSelectionInput,
    useSelectionTouchInput,
} from "./hooks";

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

export interface ScrollableGridProps extends GridProps {
    onScroll?: (x: number, y: number) => void;
    scrollContainerRef?: ForwardedRef<HTMLDivElement | null>;
}

function useScrollContainerRefs(
    outer: ForwardedRef<HTMLDivElement | null> | undefined,
    inner: MutableRefObject<HTMLDivElement | null>
) {
    return useCallback(
        (ref: HTMLDivElement | null) => {
            inner.current = ref;
            if (outer) {
                if (typeof outer == "function") {
                    outer(ref);
                } else {
                    outer.current = ref;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [outer]
    );
}

function triggerOnScroll(
    onScroll: ((x: number, y: number) => void) | undefined,
    scrollContainerRef: MutableRefObject<HTMLDivElement | null>
) {
    if (onScroll && scrollContainerRef.current) {
        onScroll(
            scrollContainerRef.current.clientLeft,
            scrollContainerRef.current.clientTop
        );
    }
}

export function ScrollableGrid({
    width,
    height,
    marks,
    onScroll,
    scrollContainerRef,
    className = "",
}: ScrollableGridProps) {
    const rows = useRows(width, height, marks);

    const scrollContainerRef_ = useRef<HTMLDivElement | null>(null);
    const { shadows, update: updateShadows } =
        useScrollShadows(scrollContainerRef_);

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            <div
                className="grid__scroll-container"
                ref={useScrollContainerRefs(
                    scrollContainerRef,
                    scrollContainerRef_
                )}
                onScroll={useCallback(() => {
                    updateShadows();
                    triggerOnScroll(onScroll, scrollContainerRef_);
                }, [updateShadows, onScroll])}
            >
                <table className="grid__table">
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export interface SelectableGridProps extends ScrollableGridProps {
    selection: [number, number] | null;
}

export function SelectableGrid({
    width,
    height,
    marks,
    selection,
    onScroll,
    scrollContainerRef,
    className = "",
}: SelectableGridProps) {
    const rows = useRows(width, height, marks);

    const scrollContainerRef_ = useRef<HTMLDivElement | null>(null);
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
                ref={useScrollContainerRefs(
                    scrollContainerRef,
                    scrollContainerRef_
                )}
                onScroll={useCallback(() => {
                    updateShadows();
                    selectionOnScroll();
                    triggerOnScroll(onScroll, scrollContainerRef_);
                }, [updateShadows, selectionOnScroll, onScroll])}
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
    onScroll,
    scrollContainerRef,
    className = "",
}: SelectableGridWithInputProps) {
    const rows = useRows(width, height, marks);

    const scrollContainerRef_ = useRef<HTMLDivElement | null>(null);
    const tableRef = useRef<HTMLTableElement | null>(null);

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
    } = useSelectionInput(width, height, selection, setSelection, tableRef);

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container"
                ref={useScrollContainerRefs(
                    scrollContainerRef,
                    scrollContainerRef_
                )}
                onScroll={useCallback(() => {
                    updateShadows();
                    selectionOnScroll();
                    triggerOnScroll(onScroll, scrollContainerRef_);
                }, [updateShadows, selectionOnScroll, onScroll])}
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

export function SelectableGridWithTouchInput({
    width,
    height,
    marks,
    selection,
    setSelection,
    autoFocus = false,
    onScroll,
    scrollContainerRef,
    className = "",
}: SelectableGridWithInputProps) {
    const rows = useRows(width, height, marks);

    const scrollContainerRef_ = useRef<HTMLDivElement | null>(null);
    const tableRef = useRef<HTMLTableElement | null>(null);

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
    } = useSelectionInput(width, height, selection, setSelection, tableRef);
    const {
        onTouchStart: selectionOnTouchStart,
        onTouchMove: selectionOnTouchMove,
        onTouchEnd: selectionOnTouchEnd,
    } = useSelectionTouchInput(width, height, setSelection, tableRef);

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container grid__scroll-container--"
                ref={useScrollContainerRefs(
                    scrollContainerRef,
                    scrollContainerRef_
                )}
                onScroll={useCallback(() => {
                    updateShadows();
                    selectionOnScroll();
                    triggerOnScroll(onScroll, scrollContainerRef_);
                }, [updateShadows, selectionOnScroll, onScroll])}
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
