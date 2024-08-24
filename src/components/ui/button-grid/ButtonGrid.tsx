import { ShowTitlesContext } from "../show-titles/ShowTitles";
import "./ButtonGrid.less";

import {
    ButtonHTMLAttributes,
    HTMLAttributes,
    ReactElement,
    useContext,
} from "react";

interface ButtonGridButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    row?: number | [number, number];
    col?: number | [number, number];
    isDestructive?: boolean;
}

export function ButtonGridButton({
    row,
    col,
    isDestructive = false,
    children,
    className = "",
    ...props
}: ButtonGridButtonProps) {
    const shouldShowTitles = useContext(ShowTitlesContext);

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
            <button
                className={
                    className +
                    " button-grid__button " +
                    (isDestructive ? "button-grid__button--destructive" : "")
                }
                {...props}
            >
                {children}
                {shouldShowTitles && props.title ? (
                    <div className="button__title">{props.title}</div>
                ) : undefined}
            </button>
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
