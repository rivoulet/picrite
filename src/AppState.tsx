import { LevelCells, LevelInfo, LevelNumbers, SavedLevelInfo } from "src/Level";

export interface LevelSelectState {
    level: null;
}

export interface PlayState {
    isEditing: false;
    level: LevelInfo & LevelCells & LevelNumbers;
}

export interface EditState {
    isEditing: true;
    level: SavedLevelInfo & LevelCells;
    savedCells: boolean[];
}

export type AppState = LevelSelectState | PlayState | EditState;
