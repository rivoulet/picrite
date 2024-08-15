import { LevelDimensions } from "../Level";
import { CellMark } from "../CellMark";

export function marksByLine(
    level: LevelDimensions,
    marks: CellMark[],
    isVertical: boolean,
) {
    const levelSize = [level.width, level.height];
    const indexScale = [1, level.width];

    const dirIndex = +isVertical;
    const primarySize = levelSize[dirIndex ^ 1];
    const secondarySize = levelSize[dirIndex];
    const primaryScale = indexScale[dirIndex ^ 1];
    const secondaryScale = indexScale[dirIndex];
    
    const lines = new Array<CellMark[]>(primarySize);
    for (
        let i = 0, cellIndexBase = 0;
        i < primarySize;
        i++, cellIndexBase += primaryScale
    ) {
        const line = new Array<CellMark>(secondarySize);
        for (
            let j = 0, cellIndex = cellIndexBase;
            j < secondarySize;
            j++, cellIndex += secondaryScale
        ) {
            line[j] = marks[cellIndex];
        }
        lines[i] = line;
    }
    return lines;
}
