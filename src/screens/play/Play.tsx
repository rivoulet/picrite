import "./Play.less";

import { useMemo, useState } from "react";
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

    const { selection, setSelection, onKeyDown } = useInput(
        marks,
        setMarks,
        isCrossing,
        setIsCrossing,
        level
    );

    useMemo(() => {
        if (levelIsSolved(level, marks)) {
            onWin();
        }
    }, [level, marks, onWin]);

    return (
        <div className="play-screen" onKeyDown={onKeyDown} tabIndex={-1}>
            <MemoPlayGrid
                level={level}
                marks={marks}
                selection={selection}
                setSelection={setSelection}
                className="play-screen__play-grid"
            />
        </div>
    );
}
