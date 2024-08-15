import { LoadedLevel } from "../Level";
import { loadLevel } from "./load";
import { levelIsSolvable } from "./solve";

export function generateLevel(width: number, height: number): LoadedLevel {
    for (;;) {
        const cells = new Array<boolean>(width * height).fill(false);
        for (let i = 0; i < width * height; i++) {
            cells[i] = Math.random() >= 0.5;
        }
        const level = loadLevel({
            width,
            height,
            cells,
        });
        if (levelIsSolvable(level)) {
            return level;
        }
    }
}
