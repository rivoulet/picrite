import "./Play.less";

import { useState } from "react";
import { CellMark } from "../../CellMark";
import { PlayGrid } from "../../components/play-grid/PlayGrid";
import { LoadedLevel } from "../../Level";
import { useInput } from "./input";

export interface PlayScreenProps {
    level: LoadedLevel;
}

export function PlayScreen({ level }: PlayScreenProps) {
    const [marks, setMarks] = useState(() =>
        new Array<CellMark>(level.width * level.height).fill(CellMark.Empty)
    );

    const { selection, setSelection, onKeyDown, onBlur } = useInput(
        marks,
        setMarks,
        level
    );

    return (
        <div className="play-screen" onKeyDown={onKeyDown} onBlur={onBlur}>
            <PlayGrid
                level={level}
                marks={marks}
                selection={selection}
                setSelection={setSelection}
                className="main-grid"
            />
        </div>
    );
}
