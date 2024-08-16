import {
    Dispatch,
    FocusEvent,
    MutableRefObject,
    KeyboardEvent as ReactKeyboardEvent,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { CellMark } from "../../CellMark";
import { LevelDimensions } from "../../Level";
import {
    Selection,
    SelectionUpdateKind,
    SetSelectionAction,
} from "../../components/grid/Selection";

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

    toggle(i: number, setMarks: Dispatch<SetStateAction<CellMark[]>>) {
        setMarks((marks) => {
            const newMarks = marks.slice();
            newMarks[i] =
                newMarks[i] === CellMark.Empty
                    ? this.isCrossing
                        ? CellMark.Cross
                        : CellMark.Mark
                    : CellMark.Empty;
            return newMarks;
        });
    }

    dragFill(
        dir: number,
        base: number,
        step: number,
        newSelection: [number, number],
        marks: CellMark[],
        setMarks: Dispatch<SetStateAction<CellMark[]>>
    ) {
        let x0 = this.dragLastPos![dir] + 1;
        let x1 = newSelection[dir] + 1;
        if (x0 > x1) {
            x1 = x0 - 1;
            x0 = newSelection[dir];
        }
        for (let x = x0, j = base + x0 * step; x < x1; x++, j += step) {
            if (marks[j] !== this.dragPrevMark!) continue;
            this.toggle(j, setMarks);
        }
    }

    handleSelectionUpdate(
        kind: SelectionUpdateKind,
        prevSelection: Selection,
        newSelection: [number, number],
        marks: CellMark[],
        setMarks: Dispatch<SetStateAction<CellMark[]>>,
        width: number
    ) {
        const i = newSelection[1] * width + newSelection[0];

        switch (kind) {
            case SelectionUpdateKind.NavStart: {
                this.navPrevMark = marks[i];

                this.toggle(i, setMarks);
                break;
            }

            case SelectionUpdateKind.NavMove: {
                const shouldIgnore =
                    !this.navIsWriting ||
                    newSelection === prevSelection ||
                    marks[i] !== this.navPrevMark!;
                if (shouldIgnore) return;

                this.toggle(i, setMarks);
                break;
            }

            case SelectionUpdateKind.DragStart: {
                this.dragStart = newSelection;
                this.dragLastPos = newSelection;
                this.dragDir = null;
                this.dragPrevMark = marks[i];

                this.toggle(i, setMarks);
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
                    if (this.dragDir === DragDir.X) {
                        this.dragFill(
                            0,
                            newSelection[1] * width,
                            1,
                            newSelection,
                            marks,
                            setMarks
                        );
                    } else {
                        this.dragFill(
                            1,
                            newSelection[0],
                            width,
                            newSelection,
                            marks,
                            setMarks
                        );
                    }
                } else if (marks[i] === this.dragPrevMark!) {
                    this.toggle(i, setMarks);
                }

                this.dragLastPos = newSelection;

                break;
            }
        }
    }
}

export function useInput(
    marks: CellMark[],
    setMarks: Dispatch<SetStateAction<CellMark[]>>,
    isCrossing: boolean,
    setIsCrossing: Dispatch<SetStateAction<boolean>>,
    gridTableRef: RefObject<HTMLTableElement>,
    level: LevelDimensions
) {
    const [selection, setSelectionRaw] = useState<Selection>(null);

    const inputRef = useRef<Input | null>(null) as MutableRefObject<Input>;
    if (inputRef.current === null) {
        inputRef.current = new Input();
    }
    inputRef.current.isCrossing = isCrossing;

    const setSelection = useCallback(
        (action: SetSelectionAction) => {
            const { selection: newSelection, kind } =
                typeof action === "function" ? action(selection) : action;
            setSelectionRaw(newSelection);
            if (!newSelection) return;
            inputRef.current.handleSelectionUpdate(
                kind,
                selection,
                newSelection,
                marks,
                setMarks,
                level.width
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selection, level.width, marks]
    );

    const onKeyDown = useCallback(
        (e: ReactKeyboardEvent) => {
            switch (e.key) {
                case " ": {
                    if (!e.repeat) {
                        if (selection) {
                            inputRef.current.navIsWriting = true;
                            setSelection({
                                selection,
                                kind: SelectionUpdateKind.NavStart,
                            });
                        } else {
                            setSelectionRaw([0, 0]);
                            gridTableRef.current?.focus();
                        }
                    }
                    e.preventDefault();
                    break;
                }

                case "x":
                case "Shift": {
                    inputRef.current.isCrossing = true;
                    setIsCrossing(true);
                    break;
                }

                case "e":
                case "Escape": {
                    setSelectionRaw(null);
                    break;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selection, setSelection]
    );

    const onKeyUp = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case " ": {
                inputRef.current.navIsWriting = false;
                break;
            }

            case "x":
            case "Shift": {
                inputRef.current.isCrossing = false;
                setIsCrossing(false);
                break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onBlur = useCallback((e: FocusEvent) => {
        if (e.relatedTarget !== gridTableRef.current) {
            setSelectionRaw(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.addEventListener("keyup", onKeyUp);
        return () => window.removeEventListener("keyup", onKeyUp);
    }, [onKeyUp]);

    return {
        selection,
        setSelection,
        onKeyDown,
        onBlur,
    };
}
