import { LevelCells, LevelDimensions, PackedLevelCells } from "../Level";

export function unpackLevel<T extends LevelDimensions & PackedLevelCells>(
    level: T
): T & LevelCells {
    if (level.cells.length !== level.width * level.height) {
        throw new RangeError("Invalid level cells");
    }
    const cells = Array.from(level.cells, (c) => c !== "0");
    return {
        ...level,
        cells,
    };
}

export function packLevel<T extends LevelDimensions & LevelCells>(
    level: T
): T & PackedLevelCells {
    return {
        ...level,
        cells: level.cells.map((c) => +c).join(""),
    };
}
