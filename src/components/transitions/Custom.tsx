import "./Slide.less";

import { cloneElement, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { TransitionProps } from "./Props";
import { useRefs } from "../../utils/useRefs";

export interface CustomTransitionProps extends TransitionProps {
    classNames: string;
}

export function Custom({
    classNames,
    timeout,
    children,
    ...props
}: CustomTransitionProps) {
    const ref = useRef<HTMLElement>(null);

    return (
        <CSSTransition
            nodeRef={ref}
            addEndListener={
                typeof timeout === "undefined"
                    ? (done) => {
                          ref.current!.addEventListener(
                              "transitionend",
                              (e) => {
                                  if (e.target === ref.current) {
                                      done();
                                  }
                              }
                          );
                      }
                    : undefined
            }
            timeout={timeout as number}
            classNames={classNames}
            {...props}
        >
            {cloneElement(children, {
                ref: useRefs(children.ref, ref),
            })}
        </CSSTransition>
    );
}
