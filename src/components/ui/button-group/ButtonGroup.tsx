import { ButtonProps } from "../button/Button";
import "./ButtonGroup.less";

import { FunctionComponentElement, HTMLAttributes } from "react";

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    children: Iterable<FunctionComponentElement<ButtonProps>>;
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
