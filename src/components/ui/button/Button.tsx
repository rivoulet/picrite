import { ShowTitlesContext } from "../show-titles/ShowTitles";
import "./Button.less";

import { ButtonHTMLAttributes, useContext } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isDestructive?: boolean;
}

export function Button({
    isDestructive = false,
    children,
    className = "",
    ...props
}: ButtonProps) {
    const shouldShowTitles = useContext(ShowTitlesContext);

    return (
        <button
            className={
                className +
                " button " +
                (isDestructive ? "button--destructive" : "")
            }
            {...props}
        >
            {children}
            {shouldShowTitles && props.title ? (
                <div className="button__title">{props.title}</div>
            ) : undefined}
        </button>
    );
}
