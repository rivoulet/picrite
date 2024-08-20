import { CellMark } from "../../CellMark";

export interface Change {
    i: number;
    prev: CellMark;
    next: CellMark;
}

export interface History {
    hasUndo: boolean;
    undo(): void;
    hasRedo: boolean;
    redo(): void;
}

export interface HistoryActions {
    clear(): void;
    setMark(i: number, mark: CellMark): void;
}
