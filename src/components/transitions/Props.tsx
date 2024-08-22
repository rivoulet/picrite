import { ForwardedRef, FunctionComponentElement } from "react";
import { EnterHandler, ExitHandler } from "react-transition-group/Transition";

export interface TransitionProps {
    appear?: boolean | undefined;
    enter?: boolean | undefined;
    exit?: boolean | undefined;

    in?: boolean | undefined;
    mountOnEnter?: boolean | undefined;
    unmountOnExit?: boolean | undefined;
    onEnter?: EnterHandler<HTMLElement> | undefined;
    onEntering?: EnterHandler<HTMLElement> | undefined;
    onEntered?: EnterHandler<HTMLElement> | undefined;
    onExit?: ExitHandler<HTMLElement> | undefined;
    onExiting?: ExitHandler<HTMLElement> | undefined;
    onExited?: ExitHandler<HTMLElement> | undefined;
    timeout?: number | undefined;
    children: FunctionComponentElement<{
        ref?: ForwardedRef<HTMLElement> | undefined;
    }>;
}
