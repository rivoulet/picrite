import "./Play.less";

import { useCallback, useMemo, useState } from "react";
import { CellMark } from "../../CellMark";
import { PlayGridMemo } from "../../components/play-grid/PlayGrid";
import { LevelCells, LevelDimensions, LoadedLevelNumbers } from "../../Level";
import { useInput } from "./Input";
import { levelIsSolved } from "../../algorithms/utils";
import {
    ButtonGroup,
    ButtonGroupButton,
} from "../../components/ui/button-group/ButtonGroup";
import { Button } from "../../components/ui/button/Button";
import {
    useHistory,
    useHistoryInput,
} from "../../components/history/useHistory";
import { RadioButtons } from "../../components/ui/radio-buttons/RadioButtons";
import { SelectionOrNull } from "../../components/grid/Selection";
import { HistoryButtons } from "../../components/history/HistoryButtons";

export interface PlayScreenProps {
    level: LevelDimensions & LevelCells & LoadedLevelNumbers;
    onWin: () => void;
}

export function PlayScreen({ level, onWin }: PlayScreenProps) {
    // NOTE: level is assumed not to change
    const [marks, setMarks] = useState(() =>
        new Array<CellMark>(level.width * level.height).fill(CellMark.Empty)
    );

    const [selection, setSelectionRaw] = useState<SelectionOrNull>(null);

    const setMarkRaw = useCallback(
        (i: number, mark: CellMark) => {
            setSelectionRaw((selection) =>
                !selection || i !== selection[1] * level.width + selection[0]
                    ? [i % level.width, Math.floor(i / level.width)]
                    : selection
            );
            setMarks((marks) => {
                const newMarks = marks.slice();
                newMarks[i] = mark;
                return newMarks;
            });
        },
        [level.width]
    );

    const history = useHistory(marks, setMarkRaw);
    const { setMark } = history;

    const [isCrossing, setIsCrossing] = useState(false);
    const [scale, setScale] = useState(1);

    const { setSelection, onKeyDown: inputOnKeyDown } = useInput(
        marks,
        setMark,
        selection,
        setSelectionRaw,
        isCrossing,
        setIsCrossing,
        level
    );

    const { onKeyDown: historyOnKeyDown } = useHistoryInput(history);

    useMemo(() => {
        if (levelIsSolved(level, marks)) {
            onWin();
        }
    }, [level, marks, onWin]);

    return (
        <div
            className="play-screen"
            onKeyDown={(e) => {
                inputOnKeyDown(e);
                historyOnKeyDown(e);
            }}
            tabIndex={-1}
        >
            <style>
                {".play-screen__play-grid { font-size: " + scale + "em; }"}
            </style>
            <PlayGridMemo
                level={level}
                marks={marks}
                selection={selection}
                setSelection={setSelection}
                className="play-screen__grid"
            />
            <div className="play-screen__controls">
                <RadioButtons
                    selected={+isCrossing}
                    setSelected={(selected) => setIsCrossing(selected > 0)}
                    name="mark-cross"
                    className={
                        "play-screen__controls__mark-cross " +
                        (isCrossing
                            ? "play-screen__controls__mark-cross--crossing"
                            : "play-screen__controls__mark-cross--marking")
                    }
                    buttons={[
                        {
                            content: "Mark",
                            className:
                                "play-screen__controls__mark-cross__mark",
                        },
                        {
                            content: "Cross",
                            className:
                                "play-screen__controls__mark-cross__cross",
                        },
                    ]}
                    hasKeyboardControls={false}
                />
                <ButtonGroup>
                    <ButtonGroupButton
                        title="Zoom in"
                        disabled={scale >= 1.5 * 1.5 * 1.5}
                        onClick={useCallback(
                            () => setScale((scale) => Math.min(scale * 1.5, 4)),
                            []
                        )}
                    >
                        <i className="fas fa-plus" />
                    </ButtonGroupButton>
                    <ButtonGroupButton
                        title="Zoom out"
                        disabled={scale <= 1 / (1.5 * 1.5 * 1.5)}
                        onClick={useCallback(
                            () =>
                                setScale((scale) =>
                                    Math.max(scale / 1.5, 1 / 4)
                                ),
                            []
                        )}
                    >
                        <i className="fas fa-minus" />
                    </ButtonGroupButton>
                </ButtonGroup>
                <HistoryButtons history={history} />
                <Button
                    title="Pause"
                    onClick={useCallback(() => {
                        console.log("Pause");
                    }, [])}
                >
                    <i className="fas fa-pause" />
                </Button>
            </div>
        </div>
    );
}
