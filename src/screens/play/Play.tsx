import "./Play.less";

import { useMemo, useRef, useState } from "react";
import { CellMark } from "../../CellMark";
import { MemoPlayGrid } from "../../components/play-grid/PlayGrid";
import { LevelCells, LevelDimensions, LoadedLevelNumbers } from "../../Level";
import { useInput } from "./Input";
import { levelIsSolved } from "../../algorithms/utils";

export interface PlayScreenProps {
    level: LevelDimensions & LevelCells & LoadedLevelNumbers;
    onWin: () => void;
}

export function PlayScreen({ level, onWin }: PlayScreenProps) {
    // NOTE: level is assumed not to change
    const [marks, setMarks] = useState(() =>
        new Array<CellMark>(level.width * level.height).fill(CellMark.Empty)
    );
    const [isCrossing, setIsCrossing] = useState(false);

    const gridTableRef = useRef<HTMLTableElement>(null);

    const { selection, setSelection, onKeyDown, onBlur } = useInput(
        marks,
        setMarks,
        isCrossing,
        setIsCrossing,
        gridTableRef,
        level
    );

    useMemo(() => {
        if (levelIsSolved(level, marks)) {
            onWin();
        }
    }, [level, marks, onWin]);

    return (
        <div
            className="play-screen"
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            tabIndex={-1}
        >
            <MemoPlayGrid
                level={level}
                marks={marks}
                selection={selection}
                setSelection={setSelection}
                className="play-screen__play-grid"
                tableRef={gridTableRef}
            />
        </div>
    );
}
