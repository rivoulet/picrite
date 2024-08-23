import { LevelCells, LevelSize } from "../Level";
import { CellMark, CellValue } from "../CellValue";

export function cellValuesByLine<V extends CellValue>(
    level: LevelSize,
    cells: V[],
    isVertical: boolean
) {
    const levelSize = [level.width, level.height];
    const indexScale = [1, level.width];

    const dirIndex = +isVertical;
    const primarySize = levelSize[dirIndex ^ 1];
    const secondarySize = levelSize[dirIndex];
    const primaryScale = indexScale[dirIndex ^ 1];
    const secondaryScale = indexScale[dirIndex];

    const lines = new Array<V[]>(primarySize);
    for (
        let i = 0, cellIndexBase = 0;
        i < primarySize;
        i++, cellIndexBase += primaryScale
    ) {
        const line = new Array<V>(secondarySize);
        for (
            let j = 0, cellIndex = cellIndexBase;
            j < secondarySize;
            j++, cellIndex += secondaryScale
        ) {
            line[j] = cells[cellIndex];
        }
        lines[i] = line;
    }
    return lines;
}

export function levelIsSolved(level: LevelCells, marks: CellMark[]) {
    for (let i = 0; i < marks.length; i++) {
        if (level.cells[i] !== (marks[i] === CellMark.Mark)) {
            return false;
        }
    }
    return true;
}
