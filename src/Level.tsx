export interface LevelDimensions {
    width: number;
    height: number;
}

export interface LevelCells {
    cells: boolean[];
}

export interface LoadedLevelNumbers {
    hNumbers: number[][];
    vNumbers: number[][];
}

export interface Level extends LevelDimensions, LevelCells {}

export interface LoadedLevel extends Level, LoadedLevelNumbers {}
