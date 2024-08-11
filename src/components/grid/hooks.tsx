import { CellMark } from "../../CellMark";
import {
    MutableRefObject,
    ReactElement,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { MemoCell } from "./Grid";

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
    const selectionChanged = selection !== prevSelection;
    if (selectionChanged) {
        setPrevSelection(selection);
    }

    const scrollContainer = scrollContainerRef.current;

    let top = 0;
    let left = 0;
    let adjustedTop = 0;
    let adjustedLeft = 0;

    if (scrollContainer && selection) {
        const cellSize =
            2 * parseFloat(getComputedStyle(scrollContainer).fontSize);

        top = cellSize * selection[1];
        left = cellSize * selection[0];
        adjustedTop = top - scrollContainer.scrollTop;
        adjustedLeft = left - scrollContainer.scrollLeft;

        if (selectionChanged) {
            const cellSizePlusTwoBorders = cellSize * 1.05;

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
