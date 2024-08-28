import "./SizeGrid.less";

import { Dispatch, KeyboardEvent, ReactElement, useRef } from "react";

import { clamp } from "src/utils";
import { useMousePointer, useTouchPointer } from "src/utils/usePointer";

function cellSize(element: HTMLElement) {
    return 2 * parseFloat(getComputedStyle(element).fontSize);
}

function offsetPosToCellPos(
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
    table: HTMLElement,
): [number, number] {
    const cellSize_ = cellSize(table);
    const halfBorderWidth = cellSize_ * 0.025;
    return [
        clamp(Math.floor((x - halfBorderWidth) / cellSize_) + 1, 1, maxWidth),
        clamp(Math.floor((y - halfBorderWidth) / cellSize_) + 1, 1, maxHeight),
    ];
}

export interface SizeGridProps {
    maxWidth: number;
    width: number;
    setWidth: Dispatch<number>;
    maxHeight: number;
    height: number;
    setHeight: Dispatch<number>;
    scale?: number | undefined;
    className?: string | undefined;
}

export function SizeGrid({
    maxWidth,
    width,
    setWidth,
    maxHeight,
    height,
    setHeight,
    scale = 1,
    className = "",
}: SizeGridProps) {
    width /= scale;
    height /= scale;
    maxWidth /= scale;
    maxHeight /= scale;

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

    const onPointer = (x: number, y: number) => {
        if (!tableRef.current) return;
        const [width, height] = offsetPosToCellPos(
            x,
            y,
            maxWidth,
            maxHeight,
            tableRef.current,
        );
        setWidth(width * scale);
        setHeight(height * scale);
    };

    const { onMouseDown, onMouseMove } = useMousePointer(
        onPointer,
        onPointer,
        tableRef,
    );
    const { onTouchStart, onTouchMove } = useTouchPointer(
        onPointer,
        onPointer,
        tableRef,
    );

    const moveSelection = (dx: number, dy: number) => {
        setWidth(clamp(width + dx, 1, maxWidth) * scale);
        setHeight(clamp(height + dy, 1, maxWidth) * scale);
    };

    const onKeyDown = (e: KeyboardEvent) => {
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
    };

    return (
        <table
            className={className + " size-grid"}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onKeyDown={onKeyDown}
            tabIndex={0}
            ref={tableRef}
        >
            <tbody>{...rows}</tbody>
        </table>
    );
}

export function SizeGridWithSize({ className, ...props }: SizeGridProps) {
    return (
        <div className={className + " size-grid-with-size"}>
            <SizeGrid {...props} />
            <div className="size-grid-with-size__size">
                {props.width} &times; {props.height}
            </div>
        </div>
    );
}
