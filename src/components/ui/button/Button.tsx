import "./Button.less";

import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    isDestructive?: boolean;
}

export function Button({
    children,
    isDestructive = false,
    className = "",
    ...props
}: ButtonProps) {
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
        </button>
    );
}
