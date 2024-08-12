import { LevelDimensions, LevelCells, LoadedLevelLines } from "../Level";

function generateLines(level: LevelDimensions & LevelCells): LoadedLevelLines {
    const levelSize = [level.width, level.height];
    const indexScale = [1, level.width];

    function generateHVLines(isVertical: boolean) {
        const dirIndex = +isVertical;
        const primarySize = levelSize[dirIndex ^ 1];
        const secondarySize = levelSize[dirIndex];
        const primaryScale = indexScale[dirIndex ^ 1];
        const secondaryScale = indexScale[dirIndex];

        const lines = new Array<number[]>(primarySize);
        for (
            let i = 0, cellIndexBase = 0;
            i < primarySize;
            i++, cellIndexBase += primaryScale
        ) {
            const line = [];
            let cur = 0;
            for (
                let j = 0, cellIndex = cellIndexBase;
                j < secondarySize;
                j++, cellIndex += secondaryScale
            ) {
                if (level.cells[cellIndex]) {
                    cur++;
                } else {
                    if (cur) {
                        line.push(cur);
                    }
                    cur = 0;
                }
            }
            if (cur) {
                line.push(cur);
            }
            lines[i] = line;
        }
        return lines;
    }

    return { hLines: generateHVLines(false), vLines: generateHVLines(true) };
}

export function loadLevel<T extends LevelDimensions & LevelCells>(
    level: T
): T & LoadedLevelLines {
    return {
        ...level,
        ...generateLines(level),
    };
}
