import { LevelCells, LevelInfo, LevelNumbers, SavedLevelInfo } from "src/Level";

export const enum StateKind {
    LevelSelect,
    Play,
    Edit,
    SharedInfo,
    Settings,
}

export interface LevelSelectState {
    kind: StateKind.LevelSelect;
}

export interface PlayState {
    kind: StateKind.Play;
    level: LevelInfo & LevelCells & LevelNumbers;
}

export interface EditState {
    kind: StateKind.Edit;
    level: SavedLevelInfo & LevelCells;
}

export interface SharedInfoState {
    kind: StateKind.SharedInfo;
    level: SavedLevelInfo & LevelCells;
}

export interface SettingsState {
    kind: StateKind.Settings;
}

export type AppState =
    | LevelSelectState
    | PlayState
    | EditState
    | SharedInfoState
    | SettingsState;
