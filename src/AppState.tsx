import { LevelCells, LevelDimensions, LoadedLevelNumbers } from "./Level";

export interface LevelSelectState {
    level: null;
}

export interface PlayState {
    isEditing: false;
    level: LevelDimensions & LevelCells & LoadedLevelNumbers;
}

export interface EditState {
    isEditing: true;
    level: LevelDimensions & LevelCells;
    saveLevel: (cells: boolean[]) => void;
}

export type AppState = LevelSelectState | PlayState | EditState;
