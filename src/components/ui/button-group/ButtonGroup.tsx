import { ShowTitlesContext } from "../show-titles/ShowTitles";
import "./ButtonGroup.less";

import {
    ButtonHTMLAttributes,
    FunctionComponentElement,
    HTMLAttributes,
    useContext,
} from "react";

export interface ButtonGroupButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    isDestructive?: boolean;
}

export function ButtonGroupButton({
    isDestructive = false,
    children,
    className = "",
    ...props
}: ButtonGroupButtonProps) {
    const shouldShowTitles = useContext(ShowTitlesContext);

    return (
        <button
            className={
                className +
                " button-group__button " +
                (isDestructive ? "button-group__button--destructive" : "")
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

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    children: Iterable<FunctionComponentElement<ButtonGroupButtonProps>>;
}

export function ButtonGroup({
    children,
    className = "",
    ...props
}: ButtonGroupProps) {
    const children_ = [];
    let i = 0;
    for (const child of children) {
        if (i) {
            children_.push(<div className="button-group__separator" key={i} />);
        }
        i++;
        children_.push(child);
    }
    return (
        <div className={className + " button-group"} {...props}>
            {...children_}
        </div>
    );
}
