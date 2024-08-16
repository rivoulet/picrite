import { CellMark } from "../CellMark";
import { LevelCells, LevelDimensions, LoadedLevelNumbers } from "../Level";

export interface SolutionMark {
    mark: CellMark;
    i: number;
}

function lineKnownMarksInner(
    i: number,
    startX: number,
    numbers: number[],
    marks: CellMark[],
    memo: (SolutionMark[] | null)[]
) {
    const memoI = i * marks.length + startX;
    const memoized = memo[memoI];
    if (typeof memoized !== "undefined") return memoized;

    const result = new Array<SolutionMark>(marks.length);

    const number = numbers[i];
    const isLastNumber = i === numbers.length - 1;

    let markStartXMax = marks.length - number;
    for (let j = i + 1; j < numbers.length; j++) {
        markStartXMax -= 1 + numbers[j];
    }

    let isFirstSolution = true;
    attempt: for (
        let markStartX = startX;
        markStartX <= markStartXMax;
        markStartX++
    ) {
        const markEndX = markStartX + number;
        const nextStartX = isLastNumber ? marks.length : markEndX + 1;

        for (let x = startX; x < markStartX; x++) {
            if (marks[x] === CellMark.Mark) continue attempt;
        }
        for (let x = markStartX; x < markEndX; x++) {
            if (marks[x] === CellMark.Cross) continue attempt;
        }
        for (let x = markEndX; x < nextStartX; x++) {
            if (marks[x] === CellMark.Mark) continue attempt;
        }

        if (!isLastNumber) {
            const innerResult = lineKnownMarksInner(
                i + 1,
                nextStartX,
                numbers,
                marks,
                memo
            );
            if (!innerResult) continue;

            if (isFirstSolution) {
                for (let x = nextStartX; x < marks.length; x++) {
                    result[x] = innerResult[x];
                }
            } else {
                for (let x = nextStartX; x < marks.length; x++) {
                    if (result[x].mark !== innerResult[x].mark) {
                        result[x] = { mark: CellMark.Empty, i: -1 };
                    } else if (
                        result[x].mark === CellMark.Mark &&
                        result[x].i !== innerResult[x].i
                    ) {
                        result[x] = { mark: CellMark.Mark, i: -1 };
                    }
                }
            }
        }

        if (isFirstSolution) {
            isFirstSolution = false;
            result.fill({ mark: CellMark.Cross, i: -1 }, startX, markStartX);
            result.fill({ mark: CellMark.Mark, i }, markStartX, markEndX);
            result.fill({ mark: CellMark.Cross, i: -1 }, markEndX, nextStartX);
        } else {
            for (let x = startX; x < markStartX; x++) {
                if (result[x].mark !== CellMark.Cross) {
                    result[x] = { mark: CellMark.Empty, i: -1 };
                }
            }
            for (let x = markStartX; x < markEndX; x++) {
                if (result[x].mark !== CellMark.Mark) {
                    result[x] = { mark: CellMark.Empty, i: -1 };
                } else if (result[x].i !== i) {
                    result[x] = { mark: CellMark.Mark, i: -1 };
                }
            }
            for (let x = markEndX; x < nextStartX; x++) {
                if (result[x].mark !== CellMark.Cross) {
                    result[x] = { mark: CellMark.Empty, i: -1 };
                }
            }
        }
    }

    const result_ = isFirstSolution ? null : result;
    memo[memoI] = result_;
    return result_;
}

export function lineKnownMarks(numbers: number[], marks: CellMark[]) {
    if (numbers.length) {
        return lineKnownMarksInner(
            0,
            0,
            numbers,
            marks,
            new Array<SolutionMark[] | null>(numbers.length * marks.length)
        );
    } else {
        for (let i = 0; i < marks.length; i++) {
            if (marks[i] === CellMark.Mark) return null;
        }
        return new Array<SolutionMark>(marks.length).fill({
            mark: CellMark.Cross,
            i: 0,
        });
    }
}

function lineKnownMarksFastInner(
    i: number,
    startX: number,
    numbers: number[],
    marks: CellMark[],
    memo: (CellMark[] | null)[]
) {
    const memoI = i * marks.length + startX;
    const memoized = memo[memoI];
    if (typeof memoized !== "undefined") return memoized;

    const result = new Array<CellMark>(marks.length);

    const number = numbers[i];
    const isLastNumber = i === numbers.length - 1;

    let markStartXMax = marks.length - number;
    for (let j = i + 1; j < numbers.length; j++) {
        markStartXMax -= 1 + numbers[j];
    }

    let isFirstSolution = true;
    attempt: for (
        let markStartX = startX;
        markStartX <= markStartXMax;
        markStartX++
    ) {
        const markEndX = markStartX + number;
        const nextStartX = isLastNumber ? marks.length : markEndX + 1;

        for (let x = startX; x < markStartX; x++) {
            if (marks[x] === CellMark.Mark) continue attempt;
        }
        for (let x = markStartX; x < markEndX; x++) {
            if (marks[x] === CellMark.Cross) continue attempt;
        }
        for (let x = markEndX; x < nextStartX; x++) {
            if (marks[x] === CellMark.Mark) continue attempt;
        }

        if (!isLastNumber) {
            const innerResult = lineKnownMarksFastInner(
                i + 1,
                nextStartX,
                numbers,
                marks,
                memo
            );
            if (!innerResult) continue;

            if (isFirstSolution) {
                for (let x = nextStartX; x < marks.length; x++) {
                    result[x] = innerResult[x];
                }
            } else {
                for (let x = nextStartX; x < marks.length; x++) {
                    if (result[x] !== innerResult[x]) {
                        result[x] = CellMark.Empty;
                    }
                }
            }
        }

        if (isFirstSolution) {
            isFirstSolution = false;
            result.fill(CellMark.Cross, startX, markStartX);
            result.fill(CellMark.Mark, markStartX, markEndX);
            result.fill(CellMark.Cross, markEndX, nextStartX);
        } else {
            for (let x = startX; x < markStartX; x++) {
                if (result[x] !== CellMark.Cross) {
                    result[x] = CellMark.Empty;
                }
            }
            for (let x = markStartX; x < markEndX; x++) {
                if (result[x] !== CellMark.Mark) {
                    result[x] = CellMark.Empty;
                }
            }
            for (let x = markEndX; x < nextStartX; x++) {
                if (result[x] !== CellMark.Cross) {
                    result[x] = CellMark.Empty;
                }
            }
        }
    }

    const result_ = isFirstSolution ? null : result;
    memo[memoI] = result_;
    return result_;
}

export function lineKnownMarksFast(numbers: number[], marks: CellMark[]) {
    if (numbers.length) {
        return lineKnownMarksFastInner(
            0,
            0,
            numbers,
            marks,
            new Array<CellMark[] | null>(numbers.length * marks.length)
        );
    } else {
        for (let i = 0; i < marks.length; i++) {
            if (marks[i] === CellMark.Mark) return null;
        }
        return new Array<CellMark>(marks.length).fill(CellMark.Cross);
    }
}

export function levelIsSolvable(
    level: LevelDimensions & LevelCells & LoadedLevelNumbers
) {
    const marks = new Array<CellMark>(level.width * level.height).fill(
        CellMark.Empty
    );

    const levelSize = [level.width, level.height];
    const indexScale = [1, level.width];
    const numbers = [level.hNumbers, level.vNumbers];

    const lineMarksWereUpdated = [
        new Array<boolean>(level.width).fill(true),
        new Array<boolean>(level.height).fill(true),
    ];

    let dirIndex = 0;
    let iterationsWithoutAdvancement = 0;

    for (;;) {
        let hasAdvanced = false;

        const primarySize = levelSize[dirIndex ^ 1];
        const secondarySize = levelSize[dirIndex];
        const primaryScale = indexScale[dirIndex ^ 1];
        const secondaryScale = indexScale[dirIndex];

        for (
            let i = 0, cellIndexBase = 0;
            i < primarySize;
            i++, cellIndexBase += primaryScale
        ) {
            if (!lineMarksWereUpdated[dirIndex][i]) continue;
            lineMarksWereUpdated[dirIndex][i] = false;

            const lineMarks = new Array<CellMark>(secondarySize);
            for (
                let j = 0, cellIndex = cellIndexBase;
                j < secondarySize;
                j++, cellIndex += secondaryScale
            ) {
                lineMarks[j] = marks[cellIndex];
            }

            const lineKnownMarks_ = lineKnownMarksFast(
                numbers[dirIndex][i],
                lineMarks
            )!;

            for (
                let j = 0, cellIndex = cellIndexBase;
                j < secondarySize;
                j++, cellIndex += secondaryScale
            ) {
                if (lineKnownMarks_[j] === lineMarks[j]) continue;
                marks[cellIndex] = lineKnownMarks_[j];
                lineMarksWereUpdated[dirIndex ^ 1][j] = true;
                hasAdvanced = true;
            }
        }

        if (hasAdvanced) {
            iterationsWithoutAdvancement = 0;
        } else {
            iterationsWithoutAdvancement++;
            if (iterationsWithoutAdvancement === 2) break;
        }

        dirIndex ^= 1;
    }

    for (let i = 0; i < marks.length; i++) {
        if (marks[i] === CellMark.Empty) return false;
    }

    return true;
}
