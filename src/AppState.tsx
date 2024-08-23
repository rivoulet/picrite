import { LevelCells, LevelNumbers } from "./Level";

export interface LevelSelectState {
    level: null;
}

export interface PlayState {
    isEditing: false;
    level: LevelCells & LevelNumbers;
}

export interface EditState {
    isEditing: true;
    level: LevelCells;
    saveLevel: (cells: boolean[]) => void;
}

export type AppState = LevelSelectState | PlayState | EditState;
