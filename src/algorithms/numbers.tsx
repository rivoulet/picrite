import { LevelDimensions, LevelCells, LevelNumbers } from "../Level";

export function levelNumbers(level: LevelDimensions & LevelCells): LevelNumbers {
    const levelSize = [level.width, level.height];
    const indexScale = [1, level.width];

    function generateHVNumbers(isVertical: boolean) {
        const dirIndex = +isVertical;
        const primarySize = levelSize[dirIndex ^ 1];
        const secondarySize = levelSize[dirIndex];
        const primaryScale = indexScale[dirIndex ^ 1];
        const secondaryScale = indexScale[dirIndex];

        const numbers = new Array<number[]>(primarySize);
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
            numbers[i] = line;
        }
        return numbers;
    }

    return {
        hNumbers: generateHVNumbers(false),
        vNumbers: generateHVNumbers(true),
    };
}
