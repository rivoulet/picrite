import "./SizeGrid.less";

import { Dispatch, ReactElement, useCallback, useRef } from "react";
import { clamp } from "../../utils";
import { useMousePointer, useTouchPointer } from "../../utils/usePointer";

export interface SizeGridProps {
    maxWidth: number;
    width: number;
    setWidth: Dispatch<number>;
    maxHeight: number;
    height: number;
    setHeight: Dispatch<number>;
}

function cellSize(element: HTMLElement) {
    return 2 * parseFloat(getComputedStyle(element).fontSize);
}

function offsetPosToCellPos(
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
    table: HTMLElement
): [number, number] {
    const cellSize_ = cellSize(table);
    const halfBorderWidth = cellSize_ * 0.025;
    return [
        clamp(Math.floor((x - halfBorderWidth) / cellSize_) + 1, 1, maxWidth),
        clamp(Math.floor((y - halfBorderWidth) / cellSize_) + 1, 1, maxHeight),
    ];
}

export function SizeGrid({
    maxWidth,
    width,
    setWidth,
    maxHeight,
    height,
    setHeight,
}: SizeGridProps) {
    const tableRef = useRef<HTMLTableElement>(null);

    const rows = new Array<ReactElement>(maxHeight);
    for (let y = 0; y < maxHeight; y++) {
        const row = new Array<ReactElement>(maxWidth);
        for (let x = 0; x < maxWidth; x++) {
            row[x] = (
                <td
                    className={
                        "size-grid__cell" +
                        (x < width && y < height
                            ? " size-grid__cell--active"
                            : "")
                    }
                    key={x}
                />
            );
        }
        rows[y] = <tr key={y}>{...row}</tr>;
    }

    const onPointer = useCallback(
        (x: number, y: number) => {
            if (!tableRef.current) return;
            const [width, height] = offsetPosToCellPos(
                x,
                y,
                maxWidth,
                maxHeight,
                tableRef.current
            );
            setWidth(width);
            setHeight(height);
        },
        [maxWidth, setWidth, maxHeight, setHeight]
    );

    const { onMouseDown, onMouseMove } = useMousePointer(
        onPointer,
        onPointer,
        tableRef
    );
    const { onTouchStart, onTouchMove } = useTouchPointer(
        onPointer,
        onPointer,
        tableRef
    );

    return (
        <table
            className="size-grid"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            ref={tableRef}
        >
            {...rows}
        </table>
    );
}
