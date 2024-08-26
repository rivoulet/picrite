import "./Button.less";

import { ButtonHTMLAttributes, useContext } from "react";

import { ShowTitlesContext } from "src/components/ui/show-titles/ShowTitles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isDestructive?: boolean;
    title?: string | undefined;
}

export function Button({
    isDestructive = false,
    className = "",
    children,
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

export interface IconButtonProps extends ButtonProps {
    icon: string;
    alwaysShowTitle?: boolean;
    title: string | undefined;
}

export interface AppendLabelToTitleIconButtonProps extends IconButtonProps {
    appendLabelToTitle: true;
    children: string;
}

export function IconButton({
    icon,
    alwaysShowTitle = false,
    title,
    children,
    ...props
}: IconButtonProps | AppendLabelToTitleIconButtonProps) {
    const shouldShowTitle = useContext(ShowTitlesContext) || alwaysShowTitle;

    return (
        <Button
            title={
                "appendLabelToTitle" in props && children
                    ? (title ? title + " " : "") + "(" + children + ")"
                    : title
            }
            {...props}
        >
            <i
                className={
                    icon +
                    " button__icon " +
                    (children ? " button__icon--has-label" : "")
                }
            />
            {children}
            {shouldShowTitle && <div className="button__title">{title}</div>}
        </Button>
    );
}
