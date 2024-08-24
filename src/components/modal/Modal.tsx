import "./Modal.less";

import { ForwardedRef, FunctionComponentElement, ReactNode } from "react";

import { Custom } from "src/components/transitions/Custom";

export interface ModalTargetProps {
    in: boolean;
    children: FunctionComponentElement<{
        ref?: ForwardedRef<HTMLElement> | undefined;
    }>;
}

export function ModalTarget({ in: in_, children }: ModalTargetProps) {
    return (
        <Custom
            classNames="modal-target-"
            in={in_}
            appear={true}
            timeout={1000}
        >
            {children}
        </Custom>
    );
}

export interface ModalProps {
    in: boolean;
    children?: ReactNode | undefined;
}

export function Modal({ in: in_, children }: ModalProps) {
    return (
        <Custom
            classNames="modal-"
            in={in_}
            appear={true}
            mountOnEnter={true}
            unmountOnExit={true}
        >
            <div className="modal">
                <div className="modal__bg" />
                {children}
            </div>
        </Custom>
    );
}
