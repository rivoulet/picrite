import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    TouchEvent,
    useCallback,
    useRef,
} from "react";
import { equal2 } from "../../utils";
import { clientPosToCellPos } from "../grid/hooks";

export function useSelectionTouchInput(
    width: number,
    height: number,
    setSelection: Dispatch<SetStateAction<[number, number] | null>>,
    tableRef: MutableRefObject<HTMLElement | null>
) {
    const touches = useRef<number[]>([]);

    const onTouchStart = useCallback(
        (e: TouchEvent) => {
            let touch0;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                switch (touches.current.indexOf(touch.identifier)) {
                    case -1: {
                        if (touches.current.length === 0) {
                            touch0 = touch;
                        }
                        touches.current.push(touch.identifier);
                        break;
                    }
                    case 0: {
                        touch0 = touch;
                        break;
                    }
                    default:
                        break;
                }
            }
            if (!touch0 || !tableRef.current) {
                return;
            }
            const newSelection = clientPosToCellPos(
                touch0.clientX,
                touch0.clientY,
                width,
                height,
                tableRef.current
            );
            setSelection((selection) =>
                !selection || !equal2(newSelection, selection)
                    ? newSelection
                    : selection
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [width, height, setSelection]
    );

    const onTouchMove = useCallback(
        (e: TouchEvent) => {
            let touch0;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touches.current.indexOf(touch.identifier) === 0) {
                    touch0 = touch;
                }
            }
            if (!touch0 || !tableRef.current) {
                return;
            }
            const newSelection = clientPosToCellPos(
                touch0.clientX,
                touch0.clientY,
                width,
                height,
                tableRef.current
            );
            setSelection((selection) =>
                !selection || !equal2(newSelection, selection)
                    ? newSelection
                    : selection
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [width, height, setSelection]
    );

    const onTouchEnd = useCallback(
        (e: TouchEvent) => {
            let touch0WasChanged = false;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const j = touches.current.indexOf(touch.identifier);
                switch (j) {
                    case -1: {
                        break;
                    }
                    case 0: {
                        touch0WasChanged = true;
                        touches.current.splice(0, 1);
                        break;
                    }
                    default: {
                        touches.current.splice(j, 1);
                        break;
                    }
                }
            }
            if (
                !touch0WasChanged ||
                !tableRef.current ||
                touches.current.length === 0
            ) {
                return;
            }
            let touch0;
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                if (touch.identifier === touches.current[0]) {
                    touch0 = touch;
                    break;
                }
            }
            const newSelection = clientPosToCellPos(
                touch0!.clientX,
                touch0!.clientY,
                width,
                height,
                tableRef.current
            );
            setSelection((selection) =>
                !selection || !equal2(newSelection, selection)
                    ? newSelection
                    : selection
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [width, height, setSelection]
    );

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
}
