import "./Grid.less";

import {
    Dispatch,
    ForwardedRef,
    MutableRefObject,
    UIEvent,
    useCallback,
    useEffect,
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
import { Selection, SetSelectionAction } from "./Selection";

function useScrollContainerRefs(
    outer: ForwardedRef<HTMLDivElement | null> | undefined,
    inner: MutableRefObject<HTMLDivElement | null>
) {
    return useCallback(
        (ref: HTMLDivElement | null) => {
            inner.current = ref;
            if (outer) {
                if (typeof outer === "function") {
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
    className?: string;
    onScroll?: (x: number, y: number) => void;
    scrollContainerRef?: ForwardedRef<HTMLDivElement | null>;
}

export function Grid({
    width,
    height,
    marks,
    className = "",
    onScroll,
    scrollContainerRef,
}: GridProps) {
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
                onScroll={useCallback(
                    (e: UIEvent) => {
                        updateShadows();
                        triggerOnScroll(onScroll, e.target as HTMLElement);
                    },
                    [updateShadows, onScroll]
                )}
            >
                <table className="grid__table">
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export interface SelectableGridProps extends GridProps {
    selection: Selection;
}

export function SelectableGrid({
    width,
    height,
    marks,
    selection,
    className = "",
    onScroll,
    scrollContainerRef,
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
                onScroll={useCallback(
                    (e: UIEvent) => {
                        updateShadows();
                        selectionOnScroll(e.target as HTMLElement);
                        triggerOnScroll(onScroll, e.target as HTMLElement);
                    },
                    [updateShadows, selectionOnScroll, onScroll]
                )}
            >
                <table className="grid__table">
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}

export interface SelectableGridWithInputProps extends SelectableGridProps {
    setSelection: Dispatch<SetSelectionAction>;
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
    onScroll,
    scrollContainerRef,
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
    className = "",
    onScroll,
    scrollContainerRef,
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

    useEffect(() => {
        window.addEventListener("touchend", selectionOnTouchEnd);
        window.addEventListener("touchcancel", selectionOnTouchEnd);
        return () => {
            window.removeEventListener("touchend", selectionOnTouchEnd);
            window.removeEventListener("touchcancel", selectionOnTouchEnd);
        };
    }, [selectionOnTouchEnd]);

    return (
        <div className={className + " grid--scrollable"}>
            {shadows}
            {selectionElement}
            <div
                className="grid__scroll-container grid__scroll-container--touch-input"
                ref={useScrollContainerRefs(
                    scrollContainerRef,
                    scrollContainerRef_
                )}
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
                    tabIndex={0}
                    autoFocus={autoFocus}
                    onKeyDown={selectionOnKeyDown}
                    onMouseDown={selectionOnMouseDown}
                    onMouseMove={selectionOnMouseMove}
                    onTouchStart={selectionOnTouchStart}
                    onTouchMove={selectionOnTouchMove}
                    ref={tableRef}
                >
                    <tbody>{...rows}</tbody>
                </table>
            </div>
        </div>
    );
}
