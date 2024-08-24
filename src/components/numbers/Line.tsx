import { memo } from "react";
import { CellMark } from "../../CellValue";
import { equalArrays } from "../../utils";
import { lineKnownMarks } from "../../algorithms/solve";

export interface LineProps {
    numbers: number[];
    marks?: CellMark[] | undefined;
    isSelected: boolean;
}

function numbersInfo(numbers: number[], marks: CellMark[] | undefined) {
    let hasHint = false;
    const numbersAreFaded = new Array<boolean>(
        Math.max(numbers.length, 1)
    ).fill(false);

    if (!marks) return { hasError: false, hasHint, numbersAreFaded };

    const knownMarks = lineKnownMarks(numbers, marks);
    if (!knownMarks) return { hasError: true, hasHint, numbersAreFaded };

    for (let x = 0; x < marks.length; x++) {
        if (knownMarks[x].mark !== marks[x]) {
            hasHint = true;
            break;
        }
    }

    if (numbers.length) {
        let filledAll = true;

        for (let i = 0, x = 0; i < numbers.length; i++) {
            for (; x < marks.length && knownMarks[x].i < i; x++);

            const start = x;

            let filledMarks = 0;
            for (; x < marks.length && knownMarks[x].i === i; x++) {
                if (knownMarks[x].mark === marks[x]) {
                    filledMarks++;
                }
            }

            const end = x;

            if (filledMarks === numbers[i]) {
                const isDelimited =
                    (start === 0 || marks[start - 1] === CellMark.Cross) &&
                    (end === marks.length || marks[end] === CellMark.Cross);
                numbersAreFaded[i] = isDelimited;
            } else {
                filledAll = false;
            }
        }

        if (filledAll) {
            numbersAreFaded.fill(true);
        }
    } else {
        numbersAreFaded[0] = !hasHint;
    }

    return { hasError: false, hasHint, numbersAreFaded };
}

export const Line = memo(
    ({ numbers, marks, isSelected }: LineProps) => {
        const { hasError, hasHint, numbersAreFaded } = numbersInfo(
            numbers,
            marks
        );

        const numbersOr0 = numbers.length ? numbers : [0];

        return (
            <ol
                className={
                    "numbers__line" +
                    (isSelected ? " numbers__line--selected" : "") +
                    (hasHint ? " numbers__line--hinted" : "") +
                    (hasError ? " numbers__line--error" : "")
                }
            >
                {numbersOr0.map((n, i) => {
                    return (
                        <li
                            key={i}
                            className={
                                "numbers__line__number" +
                                (numbersAreFaded[i]
                                    ? " numbers__line__number--faded"
                                    : "")
                            }
                        >
                            {n}
                        </li>
                    );
                })}
            </ol>
        );
    },
    (prevProps, nextProps) =>
        equalArrays(prevProps.numbers, nextProps.numbers) &&
        (prevProps.marks
            ? !!nextProps.marks && equalArrays(prevProps.marks, nextProps.marks)
            : !nextProps.marks) &&
        prevProps.isSelected === nextProps.isSelected
);
