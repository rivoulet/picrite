import "./Play.less";

import { useState } from "react";
import { CellMark } from "../../CellMark";
import { MemoPlayGrid } from "../../components/play-grid/PlayGrid";
import { LoadedLevel } from "../../Level";
import { useInput } from "./Input";

export interface PlayScreenProps {
    level: LoadedLevel;
}

export function PlayScreen({ level }: PlayScreenProps) {
    const [marks, setMarks] = useState(() =>
        new Array<CellMark>(level.width * level.height).fill(CellMark.Empty)
    );
    const [isCrossing, setIsCrossing] = useState(false);

    const { selection, setSelection, onKeyDown, onBlur } = useInput(
        marks,
        setMarks,
        isCrossing,
        setIsCrossing,
        level
    );

    return (
        <div className="play-screen" onKeyDown={onKeyDown} onBlur={onBlur}>
            <MemoPlayGrid
                level={level}
                marks={marks}
                selection={selection}
                setSelection={setSelection}
                className="main-grid"
            />
        </div>
    );
}
