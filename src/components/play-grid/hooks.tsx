import {
    Dispatch,
    FocusEvent,
    KeyboardEvent as ReactKeyboardEvent,
    RefObject,
    useCallback,
    useEffect,
} from "react";
import {
    SelectionOrNull,
    SelectionUpdateKind,
    SetSelectionAction,
} from "../grid/Selection";

export function useInput(
    selection: SelectionOrNull,
    setSelection: Dispatch<SetSelectionAction>,
    tableRef: RefObject<HTMLTableElement>
) {
    const onKeyDown = useCallback(
        (e: ReactKeyboardEvent) => {
            if (e.key !== " ") return;
            e.preventDefault();
            if (e.repeat) return;
            if (selection) {
                setSelection({
                    selection,
                    kind: SelectionUpdateKind.NavStart,
                });
            } else {
                setSelection({
                    selection: [0, 0],
                    kind: SelectionUpdateKind.Focus,
                });
                tableRef.current?.focus();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selection, setSelection]
    );

    const onKeyUp = useCallback(
        (e: KeyboardEvent) => {
            if (e.key !== " ") return;
            setSelection((selection) => {
                return selection
                    ? {
                          selection,
                          kind: SelectionUpdateKind.NavEnd,
                      }
                    : null;
            });
        },
        [setSelection]
    );

    useEffect(() => {
        window.addEventListener("keyup", onKeyUp);
        return () => window.removeEventListener("keyup", onKeyUp);
    }, [onKeyUp]);

    const onBlur = useCallback(
        (e: FocusEvent) => {
            if (e.relatedTarget !== tableRef.current) {
                setSelection(null);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setSelection]
    );

    return { onKeyDown, onBlur };
}
