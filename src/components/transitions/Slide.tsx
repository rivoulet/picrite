import "./Slide.less";

import { Custom } from "./Custom";
import { TransitionProps } from "./Props";
import { SlideDir } from "./SlideDir";

export interface SlideProps extends TransitionProps {
    dir: SlideDir;
}

export function Slide({ children, dir, ...props }: SlideProps) {
    return (
        <Custom classNames={"slide--" + dir + " slide"} {...props}>
            {children}
        </Custom>
    );
}
