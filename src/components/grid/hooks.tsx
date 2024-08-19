import {
    Dispatch,
    KeyboardEvent,
    ReactElement,
    RefObject,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { clamp, equal2 } from "../../utils";
import { CellMark } from "../../CellMark";
import { CellMemo } from "./Cell";
import {
    Selection,
    SelectionOrNull,
    SelectionUpdateKind,
    SetSelectionAction,
} from "./Selection";
import { useMousePointer, useTouchPointer } from "../../utils/usePointer";

function cellSize(element: HTMLElement) {
    return 2 * parseFloat(getComputedStyle(element).fontSize);
}

function offsetPosToCellPos(
    x: number,
    y: number,
    width: number,
    height: number,
    table: HTMLElement
): [number, number] {
    const cellSize_ = cellSize(table);
    const halfBorderWidth = cellSize_ * 0.025;
    return [
        clamp(Math.floor((x - halfBorderWidth) / cellSize_), 0, width - 1),
        clamp(Math.floor((y - halfBorderWidth) / cellSize_), 0, height - 1),
    ];
}

export function useRows(width: number, height: number, marks: CellMark[]) {
    return useMemo(() => {
        const rows = new Array<ReactElement>(height);
        for (let y = 0; y < height; y++) {
            const row = new Array<ReactElement>(width);
            for (let x = 0; x < width; x++) {
                row[x] = <CellMemo key={x} mark={marks[y * width + x]} />;
            }
            rows[y] = <tr key={y}>{...row}</tr>;
        }
        return rows;
    }, [width, height, marks]);
}

export function useSelection(
    width: number,
    selection: SelectionOrNull,
    scrollContainerRef: RefObject<HTMLElement>
) {
    const [prevSelection, setPrevSelection] = useState(selection);
    const selectionWasChanged = selection !== prevSelection;
    if (selectionWasChanged) {
        setPrevSelection(selection);
    }

    const selectionElementRef = useRef<HTMLDivElement>(null);
    const posRef = useRef({
        top: 0,
        left: 0,
    });

    const scrollContainer = scrollContainerRef.current;

    let top = 0;
    let left = 0;
    let adjustedTop = 0;
    let adjustedLeft = 0;

    if (scrollContainer && selection) {
        const cellSize_ = cellSize(scrollContainer);

        top = cellSize_ * selection[1];
        left = cellSize_ * selection[0];
        adjustedTop = top - scrollContainer.scrollTop;
        adjustedLeft = left - scrollContainer.scrollLeft;

        if (selectionWasChanged) {
            const cellSizePlusTwoBorders = cellSize_ * 1.05;

            const bottom =
                top - scrollContainer.clientHeight + cellSizePlusTwoBorders;
            let scrollTop = scrollContainer.scrollTop;
            if (scrollTop < bottom) {
                scrollTop = bottom;
            } else if (scrollTop > top) {
                scrollTop = top;
            }

            const right =
                left - scrollContainer.clientWidth + cellSizePlusTwoBorders;
            let scrollLeft = scrollContainer.scrollLeft;
            if (scrollLeft < right) {
                scrollLeft = right;
            } else if (scrollLeft > left) {
                scrollLeft = left;
            }

            scrollContainer.scroll({
                top: scrollTop,
                left: scrollLeft,
                behavior: "smooth",
            });
        }
    }

    posRef.current.top = top;
    posRef.current.left = left;

    const selectionElement = (
        <div
            className={
                "grid__selection" +
                (selection ? " grid__selection--active" : "")
            }
            style={{
                top: adjustedTop + "px",
                left: adjustedLeft + "px",
            }}
            ref={selectionElementRef}
        >
            <div className="grid__selection__shadow" />
        </div>
    );

    return {
        selectionElement,
        onScroll: useCallback((e: HTMLElement) => {
            if (selectionElementRef.current) {
                selectionElementRef.current.style.top =
                    posRef.current.top - e.scrollTop + "px";
                selectionElementRef.current.style.left =
                    posRef.current.left - e.scrollLeft + "px";
            }
        }, []),
    };
}

export function useSelectionInput(
    width: number,
    height: number,
    selection: SelectionOrNull,
    setSelection: Dispatch<SetSelectionAction>,
    tableRef: RefObject<HTMLElement>
) {
    const moveSelection = useCallback(
        (dx: number, dy: number) => {
            if (!selection) {
                setSelection({
                    selection: [0, 0],
                    kind: SelectionUpdateKind.NavMove,
                });
                return;
            }
            const newSelection: Selection = [
                clamp(selection[0] + dx, 0, width - 1),
                clamp(selection[1] + dy, 0, height - 1),
            ];
            if (!equal2(newSelection, selection)) {
                setSelection({
                    selection: newSelection,
                    kind: SelectionUpdateKind.NavMove,
                });
            }
        },
        [width, height, selection, setSelection]
    );

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp": {
                    moveSelection(0, -1);
                    e.preventDefault();
                    break;
                }
                case "ArrowDown": {
                    moveSelection(0, 1);
                    e.preventDefault();
                    break;
                }
                case "ArrowLeft": {
                    moveSelection(-1, 0);
                    e.preventDefault();
                    break;
                }
                case "ArrowRight": {
                    moveSelection(1, 0);
                    e.preventDefault();
                    break;
                }
            }
            return;
        },
        [moveSelection]
    );

    const onPointerDown = useCallback(
        (x: number, y: number) => {
            const newSelection = offsetPosToCellPos(
                x,
                y,
                width,
                height,
                tableRef.current!
            );
            setSelection((selection) => {
                return {
                    selection:
                        !selection || !equal2(newSelection, selection)
                            ? newSelection
                            : selection,
                    kind: SelectionUpdateKind.DragStart,
                };
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [width, height, setSelection]
    );

    const onPointerDrag = useCallback(
        (x: number, y: number) => {
            const newSelection = offsetPosToCellPos(
                x,
                y,
                width,
                height,
                tableRef.current!
            );
            setSelection((selection) => {
                return {
                    selection:
                        !selection || !equal2(newSelection, selection)
                            ? newSelection
                            : selection,
                    kind: SelectionUpdateKind.DragMove,
                };
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [width, height, setSelection]
    );

    return {
        onKeyDown,
        onPointerDown,
        onPointerDrag,
        ...useMousePointer(onPointerDown, onPointerDrag, tableRef),
    };
}

export function useSelectionTouchInput(
    onPointerDown: (offsetX: number, offsetY: number) => void,
    onPointerDrag: (offsetX: number, offsetY: number) => void,
    tableRef: RefObject<HTMLElement>
) {
    return useTouchPointer(onPointerDown, onPointerDrag, tableRef);
}
