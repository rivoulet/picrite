import "./ButtonGrid.less";

import { FunctionComponentElement, HTMLAttributes, ReactElement } from "react";

import { ButtonProps } from "src/components/ui/button/Button";

export interface ButtonGridButtonProps {
    row?: number | [number, number];
    col?: number | [number, number];
    children: FunctionComponentElement<ButtonProps>;
}

export function ButtonGridButton({
    row,
    col,
    children,
}: ButtonGridButtonProps) {
    return (
        <div
            className="button-grid__button__container"
            style={{
                gridRow: row
                    ? typeof row === "number"
                        ? row
                        : row[0] + "/" + row[1]
                    : undefined,
                gridColumn: col
                    ? typeof col === "number"
                        ? col
                        : col[0] + "/" + col[1]
                    : undefined,
            }}
        >
            {children}
        </div>
    );
}

interface ButtonGridProps extends HTMLAttributes<HTMLDivElement> {
    rows: number;
    cols: number;
    children: Iterable<
        ReactElement<ButtonGridButtonProps, typeof ButtonGridButton>
    >;
}

export function ButtonGrid({
    rows,
    cols,
    children,
    className = "",
    style = {},
    ...props
}: ButtonGridProps) {
    return (
        <div
            className={className + " button-grid"}
            style={{
                ...style,
                gridTemplate:
                    "repeat(" +
                    rows +
                    ", minmax(0, 1fr)) / repeat(" +
                    cols +
                    ", minmax(0, 1fr))",
            }}
            {...props}
        >
            {children}
        </div>
    );
}
