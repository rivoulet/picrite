import {
    Dispatch,
    MutableRefObject,
    KeyboardEvent as ReactKeyboardEvent,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { CellMark } from "../../CellValue";
import { LevelSize } from "../../Level";
import {
    Selection,
    SelectionOrNull,
    SelectionUpdateKind,
    SetSelectionAction,
} from "../../components/grid/Selection";
import { drawLine } from "../../utils/drawLine";

const enum DragDir {
    X,
    Y,
}

class Input {
    isCrossing: boolean = false;

    navIsWriting: boolean = false;
    navPrevMark: CellMark | null = null;

    dragStart: [number, number] | null = null;
    dragLastPos: [number, number] | null = null;
    dragDir: DragDir | null = null;
    dragPrevMark: CellMark | null = null;

    toggle(
        i: number,
        marks: CellMark[],
        setMark: (i: number, mark: CellMark) => void
    ) {
        setMark(
            i,
            marks[i] === CellMark.Empty
                ? this.isCrossing
                    ? CellMark.Cross
                    : CellMark.Mark
                : CellMark.Empty
        );
    }

    handleSelectionUpdate(
        kind: SelectionUpdateKind,
        prevSelection: SelectionOrNull,
        newSelection: Selection,
        marks: CellMark[],
        setMark: (i: number, mark: CellMark) => void,
        width: number
    ) {
        const i = newSelection[1] * width + newSelection[0];

        switch (kind) {
            case SelectionUpdateKind.Focus: {
                break;
            }

            case SelectionUpdateKind.NavStart: {
                this.navIsWriting = true;
                this.navPrevMark = marks[i];

                this.toggle(i, marks, setMark);
                break;
            }

            case SelectionUpdateKind.NavMove: {
                const shouldIgnore =
                    !this.navIsWriting ||
                    newSelection === prevSelection ||
                    marks[i] !== this.navPrevMark!;
                if (shouldIgnore) return;

                this.toggle(i, marks, setMark);
                break;
            }

            case SelectionUpdateKind.NavEnd: {
                this.navIsWriting = false;
                break;
            }

            case SelectionUpdateKind.DragStart: {
                this.dragStart = newSelection;
                this.dragLastPos = newSelection;
                this.dragDir = null;
                this.dragPrevMark = marks[i];

                this.toggle(i, marks, setMark);
                break;
            }

            case SelectionUpdateKind.DragMove: {
                if (newSelection === prevSelection) return;

                const matchesX = newSelection[0] === this.dragStart![0];
                const matchesY = newSelection[1] === this.dragStart![1];
                const matchesDir =
                    (matchesX && this.dragDir !== DragDir.X) ||
                    (matchesY && this.dragDir !== DragDir.Y);
                if (!matchesDir) {
                    this.dragLastPos = null;
                    return;
                }
                if (this.dragDir === null) {
                    this.dragDir = matchesY ? DragDir.X : DragDir.Y;
                }

                if (this.dragLastPos) {
                    drawLine(newSelection, this.dragLastPos, (x, y) => {
                        const j = y * width + x;
                        if (marks[j] !== this.dragPrevMark!) return;
                        this.toggle(j, marks, setMark);
                    });
                } else if (marks[i] === this.dragPrevMark!) {
                    this.toggle(i, marks, setMark);
                }

                this.dragLastPos = newSelection;

                break;
            }
        }
    }
}

export function useInput(
    marks: CellMark[],
    setMark: (i: number, mark: CellMark) => void,
    selection: SelectionOrNull,
    setSelectionRaw: Dispatch<SetStateAction<SelectionOrNull>>,
    isCrossing: boolean,
    setIsCrossing: Dispatch<SetStateAction<boolean>>,
    level: LevelSize
) {
    const inputRef = useRef<Input | null>(null) as MutableRefObject<Input>;
    if (inputRef.current === null) {
        inputRef.current = new Input();
    }
    inputRef.current.isCrossing = isCrossing;

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
                marks,
                setMark,
                level.width
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selection, level.width, marks, setMark]
    );

    const onKeyDown = useCallback(
        (e: ReactKeyboardEvent) => {
            switch (e.key) {
                case "x":
                case "Shift": {
                    setIsCrossing(true);
                    break;
                }

                case "e":
                case "Escape": {
                    setSelection(null);
                    break;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selection, setSelection]
    );

    const onKeyUp = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case "x":
            case "Shift": {
                setIsCrossing(false);
                break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.addEventListener("keyup", onKeyUp);
        return () => window.removeEventListener("keyup", onKeyUp);
    }, [onKeyUp]);

    return {
        setSelection,
        onKeyDown,
    };
}
