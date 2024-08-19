import "./ButtonGroup.less";

import { ButtonHTMLAttributes, HTMLAttributes, ReactElement } from "react";

type ButtonGroupButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonGroupButton({
    children,
    className = "",
    ...props
}: ButtonGroupButtonProps) {
    return (
        <button className={className + " button-group__button"} {...props}>
            {children}
        </button>
    );
}

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    children: Iterable<
        ReactElement<ButtonGroupButtonProps, typeof ButtonGroupButton>
    >;
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
