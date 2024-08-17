import {
    Dispatch,
    FocusEvent,
    KeyboardEvent,
    RefObject,
    useCallback,
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
        (e: KeyboardEvent) => {
            if (e.key === " ") {
                if (selection) return;
                e.preventDefault();
                if (e.repeat) return;
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
