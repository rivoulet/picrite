import "./Slide.less";

import { Custom } from "./Custom";
import { TransitionProps } from "./Props";

export function Slide({ children, ...props }: TransitionProps) {
    return (
        <Custom classNames="slide" {...props}>
            {children}
        </Custom>
    );
}
