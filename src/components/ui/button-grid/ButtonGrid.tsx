import {
    BaseButtonProps,
    Button,
    IconButtonProps,
    RawButtonProps,
} from "../button/Button";
import "./ButtonGrid.less";

import { HTMLAttributes, ReactElement } from "react";

export interface BaseButtonGridButtonProps extends BaseButtonProps {
    row?: number | [number, number];
    col?: number | [number, number];
}

export interface RawButtonGridButtonProps
    extends RawButtonProps,
        BaseButtonGridButtonProps {}

export interface IconButtonGridButtonProps
    extends IconButtonProps,
        BaseButtonGridButtonProps {}

export type ButtonGridButtonProps =
    | RawButtonGridButtonProps
    | IconButtonGridButtonProps;

export function ButtonGridButton({
    row,
    col,
    children,
    ...props
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
            <Button {...props}>{children}</Button>
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
