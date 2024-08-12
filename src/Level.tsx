export interface LevelDimensions {
    width: number;
    height: number;
}

export interface PackedLevelCells {
    cells: string;
}

export interface LevelCells {
    cells: boolean[];
}

export interface LoadedLevelLines {
    hLines: number[][];
    vLines: number[][];
}

export interface PackedLevel extends LevelDimensions, PackedLevelCells {}

export interface Level extends LevelDimensions, LevelCells {}

export interface LoadedLevel extends Level, LoadedLevelLines {}
