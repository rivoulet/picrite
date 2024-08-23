import { LevelCells, LevelNumbers } from "../Level";
import { levelNumbers } from "./numbers";
import { levelIsSolvable } from "./solve";

export function generateBlankLevel(width: number, height: number): LevelCells {
    return {
        width,
        height,
        cells: new Array<boolean>(width * height).fill(false),
    };
}

export function generateLevel(
    width: number,
    height: number
): LevelCells & LevelNumbers {
    for (;;) {
        const cells = new Array<boolean>(width * height);
        for (let i = 0; i < width * height; i++) {
            cells[i] = Math.random() >= 0.5;
        }
        const level = {
            width,
            height,
            cells,
        };
        const levelWithNumbers = {
            ...level,
            ...levelNumbers(level),
        };
        if (levelIsSolvable(levelWithNumbers)) return levelWithNumbers;
    }
}
