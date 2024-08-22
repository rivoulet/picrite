export interface PackedLevel {
    cells: string;
}

export interface LevelDimensions {
    width: number;
    height: number;
}

export interface LevelCells {
    cells: boolean[];
}

export interface LevelNumbers {
    hNumbers: number[][];
    vNumbers: number[][];
}
