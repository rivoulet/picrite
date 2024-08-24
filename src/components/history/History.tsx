import { CellValue } from "../../CellValue";

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
