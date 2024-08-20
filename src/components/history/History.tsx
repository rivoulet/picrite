import { CellValue } from "../../CellValue";

export interface Change<V extends CellValue> {
    i: number;
    prev: V;
    next: V;
}

export interface History {
    hasUndo: boolean;
    undo(): void;
    hasRedo: boolean;
    redo(): void;
}

export interface HistoryActions<V extends CellValue> {
    clear(): void;
    setCell(i: number, value: V): void;
}
