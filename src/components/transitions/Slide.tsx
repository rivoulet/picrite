import "./Slide.less";

import { cloneElement, ReactElement, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { EnterHandler, ExitHandler } from "react-transition-group/Transition";

export interface SlideProps {
    in?: boolean | undefined;
    mountOnEnter?: boolean | undefined;
    unmountOnExit?: boolean | undefined;
    onEnter?: EnterHandler<HTMLElement> | undefined;
    onEntering?: EnterHandler<HTMLElement> | undefined;
    onEntered?: EnterHandler<HTMLElement> | undefined;
    onExit?: ExitHandler<HTMLElement> | undefined;
    onExiting?: ExitHandler<HTMLElement> | undefined;
    onExited?: ExitHandler<HTMLElement> | undefined;

    children: ReactElement;
}

export function Slide({ children, ...props }: SlideProps) {
    const ref = useRef<HTMLElement>(null);

    return (
        <CSSTransition
            nodeRef={ref}
            addEndListener={(done) => {
                ref.current!.addEventListener("transitionend", (e) => {
                    if (e.target === ref.current) {
                        done();
                    }
                });
            }}
            classNames="slide"
            {...props}
        >
            {cloneElement(children, {
                ref,
            })}
        </CSSTransition>
    );
}
