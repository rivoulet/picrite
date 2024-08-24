import {
    Dispatch,
    MutableRefObject,
    KeyboardEvent as ReactKeyboardEvent,
    SetStateAction,
    useCallback,
    useRef,
} from "react";
import { LevelSize } from "../../Level";
import {
    Selection,
    SelectionOrNull,
    SelectionUpdateKind,
    SetSelectionAction,
} from "../../components/grid/Selection";
import { drawLine } from "../../utils/drawLine";

class Input {
    navIsWriting: boolean = false;
    navPrevValue: boolean | null = null;

    dragStart: [number, number] | null = null;
    dragLastPos: [number, number] | null = null;
    dragPrevValue: boolean | null = null;

    toggle(
        i: number,
        cells: boolean[],
        setCell: (i: number, mark: boolean) => void
    ) {
        setCell(i, !cells[i]);
    }

    handleSelectionUpdate(
        kind: SelectionUpdateKind,
        prevSelection: SelectionOrNull,
        newSelection: Selection,
        cells: boolean[],
        setCell: (i: number, mark: boolean) => void,
        width: number
    ) {
        const i = newSelection[1] * width + newSelection[0];

        switch (kind) {
            case SelectionUpdateKind.Focus: {
                break;
            }

            case SelectionUpdateKind.NavStart: {
                this.navIsWriting = true;
                this.navPrevValue = cells[i];

                this.toggle(i, cells, setCell);
                break;
            }

            case SelectionUpdateKind.NavMove: {
                const shouldIgnore =
                    !this.navIsWriting ||
                    newSelection === prevSelection ||
                    cells[i] !== this.navPrevValue!;
                if (shouldIgnore) return;

                this.toggle(i, cells, setCell);
                break;
            }

            case SelectionUpdateKind.NavEnd: {
                this.navIsWriting = false;
                break;
            }

            case SelectionUpdateKind.DragStart: {
                this.dragStart = newSelection;
                this.dragLastPos = newSelection;
                this.dragPrevValue = cells[i];

                this.toggle(i, cells, setCell);
                break;
            }

            case SelectionUpdateKind.DragMove: {
                if (newSelection === prevSelection) return;

                if (this.dragLastPos) {
                    drawLine(newSelection, this.dragLastPos, (x, y) => {
                        const j = y * width + x;
                        if (cells[j] !== this.dragPrevValue!) return;
                        this.toggle(j, cells, setCell);
                    });
                } else if (cells[i] === this.dragPrevValue!) {
                    this.toggle(i, cells, setCell);
                }

                this.dragLastPos = newSelection;

                break;
            }
        }
    }
}

export function useInput(
    cells: boolean[],
    setCell: (i: number, mark: boolean) => void,
    selection: SelectionOrNull,
    setSelectionRaw: Dispatch<SetStateAction<SelectionOrNull>>,
    level: LevelSize
) {
    const inputRef = useRef<Input | null>(null) as MutableRefObject<Input>;
    if (inputRef.current === null) {
        inputRef.current = new Input();
    }

    const setSelection = useCallback(
        (action: SetSelectionAction) => {
            const update =
                typeof action === "function" ? action(selection) : action;
            if (!update) {
                setSelectionRaw(null);
                return;
            }
            const { selection: newSelection, kind } = update;
            setSelectionRaw(newSelection);
            inputRef.current.handleSelectionUpdate(
                kind,
                selection,
                newSelection,
                cells,
                setCell,
                level.width
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selection, level.width, cells, setCell]
    );

    const onKeyDown = (e: ReactKeyboardEvent) => {
        switch (e.key) {
            case "e":
            case "Escape": {
                setSelection(null);
                break;
            }
        }
    };

    return {
        setSelection,
        onKeyDown,
    };
}
