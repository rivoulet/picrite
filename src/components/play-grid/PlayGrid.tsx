import "./PlayGrid.less";

import { SelectableGridWithTouchInput } from "../grid/Grid";
import { LevelDimensions, LoadedLevelLines } from "../../Level";
import { CellMark } from "../../CellMark";
import { useMemo, useState } from "react";
import { NumbersMemo } from "../grid/Numbers";

export interface PlayGridProps {
    level: LevelDimensions & LoadedLevelLines;
    marks: CellMark[];
    className?: string;
}

function borderExtLines(size: number, selection: number) {
    const lines = new Array(size);
    for (let i = 0; i < size; i++) {
        lines[i] = (
            <div
                key={i}
                className={
                    "play-grid__numbers-border-ext__line" +
                    (selection === i
                        ? " play-grid__numbers-border-ext__line--selected"
                        : "")
                }
            />
        );
    }
    return lines;
}

export function PlayGrid({ level, marks, className = "" }: PlayGridProps) {
    const [selection, setSelection] = useState<[number, number] | null>(null);

    return (
        <div className={className + " play-grid"}>
            <div className="play-grid__selection-cover play-grid__selection-cover--left" />
            <div className="play-grid__selection-cover play-grid__selection-cover--top" />
            <div className="play-grid__numbers-border-ext play-grid__numbers-border-ext--v">
                {...useMemo(
                    () =>
                        borderExtLines(
                            level.width,
                            selection ? selection[0] : -1
                        ),
                    [level.width, selection]
                )}
            </div>
            <div className="play-grid__numbers-border-ext play-grid__numbers-border-ext--h">
                {...useMemo(
                    () =>
                        borderExtLines(
                            level.height,
                            selection ? selection[1] : -1
                        ),
                    [level.height, selection]
                )}
            </div>
            <NumbersMemo
                isVertical={true}
                level={level}
                selection={selection ? selection[0] : -1}
                className="play-grid__numbers play-grid__numbers--v"
            />
            <NumbersMemo
                isVertical={false}
                level={level}
                selection={selection ? selection[1] : -1}
                className="play-grid__numbers play-grid__numbers--h"
            />
            <SelectableGridWithTouchInput
                width={level.width}
                height={level.height}
                marks={marks}
                selection={selection}
                setSelection={setSelection}
                autoFocus={true}
                className="play-grid__grid"
            />
        </div>
    );
}
