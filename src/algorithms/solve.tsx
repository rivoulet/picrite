import { CellMark } from "../CellMark";

export interface SolutionMark {
    mark: CellMark;
    i: number;
}

function lineKnownMarksInner(
    i: number,
    startX: number,
    numbers: number[],
    marks: CellMark[],
    result: SolutionMark[]
): boolean {
    const len = numbers[i];

    let markStartXMax = result.length - len;
    for (let j = i + 1; j < numbers.length; j++) {
        markStartXMax -= 1 + numbers[j];
    }

    let hasSolutions = false;
    attempt: for (
        let markStartX = startX;
        markStartX <= markStartXMax;
        markStartX++
    ) {
        const attemptResult = result.slice();

        const markEndX = markStartX + len;
        attemptResult.fill({ mark: CellMark.Cross, i: -1 }, startX, markStartX);
        attemptResult.fill({ mark: CellMark.Mark, i }, markStartX, markEndX);
        let nextStartX;
        if (i < numbers.length - 1) {
            attemptResult[markEndX] = { mark: CellMark.Cross, i: -1 };
            nextStartX = markEndX + 1;
        } else {
            attemptResult.fill({ mark: CellMark.Cross, i: -1 }, markEndX);
            nextStartX = result.length;
        }

        for (let x = startX; x < nextStartX; x++) {
            if (
                marks[x] !== CellMark.Empty &&
                attemptResult[x].mark !== marks[x]
            ) {
                continue attempt;
            }
        }

        if (
            i < numbers.length - 1 &&
            !lineKnownMarksInner(
                i + 1,
                nextStartX,
                numbers,
                marks,
                attemptResult
            )
        ) {
            continue;
        }

        if (hasSolutions) {
            for (let j = startX; j < result.length; j++) {
                if (result[j].mark !== attemptResult[j].mark) {
                    result[j] = { mark: CellMark.Empty, i: -1 };
                } else if (
                    result[j].mark === CellMark.Mark &&
                    result[j].i !== attemptResult[j].i
                ) {
                    result[j] = { mark: CellMark.Mark, i: -1 };
                }
            }
        } else {
            hasSolutions = true;
            for (let j = startX; j < result.length; j++) {
                result[j] = attemptResult[j];
            }
        }
    }

    return hasSolutions;
}

export function lineKnownMarks(
    numbers: number[],
    marks: CellMark[]
): SolutionMark[] | null {
    const result: SolutionMark[] = new Array(marks.length);
    if (numbers.length) {
        if (!lineKnownMarksInner(0, 0, numbers, marks, result)) {
            return null;
        }
    } else {
        for (let i = 0; i < marks.length; i++) {
            if (marks[i] === CellMark.Mark) {
                return null;
            }
        }
        result.fill({ mark: CellMark.Cross, i: 0 });
    }
    return result;
}
