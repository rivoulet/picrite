import "./Button.less";

import { ButtonHTMLAttributes, useContext } from "react";

import { ShowTitlesContext } from "src/components/ui/show-titles/ShowTitles";

export interface BaseButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
    isDestructive?: boolean;
}

export interface RawButtonProps extends BaseButtonProps {
    icon?: never;
    title?: string | undefined;
}

export interface IconButtonProps extends BaseButtonProps {
    icon: string;
    title: string | null;
}

export type ButtonProps = RawButtonProps | IconButtonProps;

export function Button({
    isDestructive = false,
    icon,
    title,
    className = "",
    children,
    ...props
}: ButtonProps) {
    const hasIcon = typeof icon !== "undefined";
    const shouldShowTitle =
        useContext(ShowTitlesContext) && hasIcon && title !== null;

    return (
        <button
            className={
                className +
                " button " +
                (isDestructive ? "button--destructive" : "")
            }
            title={title ?? undefined}
            {...props}
        >
            {hasIcon && (
                <i
                    className={
                        icon +
                        " button__icon " +
                        (children ? " button__icon--children" : "")
                    }
                />
            )}
            {children}
            {shouldShowTitle && <div className="button__title">{title}</div>}
        </button>
    );
}
