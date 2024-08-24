export const enum SolvedState {
    Unsolved,
    Solved,
    Own,
}

export interface BaseLevelInfo {
    name: string;
}

export interface TransientLevelInfo extends BaseLevelInfo {
    id: null;
}

export interface SavedLevelInfo extends BaseLevelInfo {
    id: string;
    solved: SolvedState;
    record: number | null;
}

export type LevelInfo = TransientLevelInfo | SavedLevelInfo;

export interface LevelSize {
    width: number;
    height: number;
}

export interface LevelCells extends LevelSize {
    cells: boolean[];
}

export interface LevelNumbers {
    hNumbers: number[][];
    vNumbers: number[][];
}
