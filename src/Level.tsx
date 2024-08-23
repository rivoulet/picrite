export interface LevelInfo {
    name: string;
}

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
