import {
    Dispatch,
    KeyboardEvent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    SetStateAction,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { clamp, equal2 } from "../../utils";
import { CellMark } from "../../CellMark";
import { MemoCell } from "./Cell";

export function cellSize(element: HTMLElement) {
    return 2 * parseFloat(getComputedStyle(element).fontSize);
}

export function clientPosToCellPos(
    x: number,
    y: number,
    width: number,
    height: number,
    table: HTMLElement
): [number, number] {
    const rect = table.getBoundingClientRect();
    const cellSize_ = cellSize(table);
    const halfBorderWidth = cellSize_ * 0.025;
    return [
        clamp(
            Math.floor((x - halfBorderWidth - rect.left) / cellSize_),
            0,
            width - 1
        ),
        clamp(
            Math.floor((y - halfBorderWidth - rect.top) / cellSize_),
            0,
            height - 1
        ),
    ];
}

export function useRows(width: number, height: number, marks: CellMark[]) {
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

export function useSelection(
    width: number,
    selection: [number, number] | null,
    scrollContainerRef: MutableRefObject<HTMLElement | null>
) {
    const selectionElementRef = useRef<HTMLDivElement | null>(null);

    const [prevSelection, setPrevSelection] = useState(selection);
    const selectionWasChanged = selection !== prevSelection;
    if (selectionWasChanged) {
        setPrevSelection(selection);
    }

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
        onScroll: useCallback(() => {
            if (selectionElementRef.current && scrollContainerRef.current) {
                selectionElementRef.current.style.top =
                    top - scrollContainerRef.current.scrollTop + "px";
                selectionElementRef.current.style.left =
                    left - scrollContainerRef.current.scrollLeft + "px";
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [top, left]),
    };
}

export function useSelectionInput(
    width: number,
    height: number,
    selection: [number, number] | null,
    setSelection: Dispatch<SetStateAction<[number, number] | null>>,
    tableRef: MutableRefObject<HTMLElement | null>
) {
    const moveSelection = useCallback(
        (dx: number, dy: number) => {
            if (!selection) {
                setSelection([0, 0]);
                return;
            }
            const newSelection: [number, number] = [
                clamp(selection[0] + dx, 0, width - 1),
                clamp(selection[1] + dy, 0, height - 1),
            ];
            if (!equal2(newSelection, selection)) {
                setSelection(newSelection);
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
                case " ": {
                    moveSelection(0, 0);
                    e.preventDefault();
                    break;
                }
            }
            return;
        },
        [moveSelection]
    );

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            if (!tableRef.current) {
                return;
            }
            const newSelection = clientPosToCellPos(
                e.clientX,
                e.clientY,
                width,
                height,
                tableRef.current
            );
            setSelection((selection) =>
                !selection || !equal2(newSelection, selection)
                    ? newSelection
                    : selection
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [width, height, setSelection]
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!tableRef.current || !e.buttons) {
                return;
            }
            const newSelection = clientPosToCellPos(
                e.clientX,
                e.clientY,
                width,
                height,
                tableRef.current
            );
            setSelection((selection) =>
                !selection || !equal2(newSelection, selection)
                    ? newSelection
                    : selection
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [width, height, setSelection]
    );

    return {
        onKeyDown,
        onMouseDown,
        onMouseMove,
    };
}
