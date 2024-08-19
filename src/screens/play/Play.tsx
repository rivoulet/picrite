import "./Play.less";

import { KeyboardEvent, useCallback, useMemo, useState } from "react";
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
import { useHistory } from "./History";
import { RadioButtons } from "../../components/ui/radio-buttons/RadioButtons";
import { SelectionOrNull } from "../../components/grid/Selection";

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

    const history = useHistory(level, setMarkRaw);
    const { undo: undoHistory, redo: redoHistory, add: addHistory } = history;

    const [isCrossing, setIsCrossing] = useState(false);
    const [scale, setScale] = useState(1);

    const setMark = useCallback(
        (i: number, mark: CellMark) => {
            addHistory({
                i,
                prev: marks[i],
                next: mark,
            });
            setMarkRaw(i, mark);
        },
        [marks, setMarkRaw, addHistory]
    );

    const { setSelection, onKeyDown: inputOnKeyDown } = useInput(
        marks,
        setMark,
        selection,
        setSelectionRaw,
        isCrossing,
        setIsCrossing,
        level
    );

    const onKeyDown = (e: KeyboardEvent) => {
        inputOnKeyDown(e);
        switch (e.key) {
            case "z": {
                if (!(e.metaKey || e.ctrlKey)) break;
                if (e.shiftKey) {
                    if (history.hasRedo) {
                        history.redo();
                    }
                } else if (history.hasUndo) {
                    history.undo();
                }
                break;
            }
        }
    };

    useMemo(() => {
        if (levelIsSolved(level, marks)) {
            onWin();
        }
    }, [level, marks, onWin]);

    return (
        <div className="play-screen" onKeyDown={onKeyDown} tabIndex={-1}>
            <style>
                {".play-screen__play-grid { font-size: " + scale + "em; }"}
            </style>
            <PlayGridMemo
                level={level}
                marks={marks}
                selection={selection}
                setSelection={setSelection}
                className="play-screen__play-grid"
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
                <ButtonGroup className="play-screen__controls__group">
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
                <ButtonGroup className="play-screen__controls__group">
                    <ButtonGroupButton
                        title="Undo"
                        disabled={!history.hasUndo}
                        onClick={useCallback(() => {
                            undoHistory();
                        }, [undoHistory])}
                    >
                        <i className="fas fa-rotate-left" />
                    </ButtonGroupButton>
                    <ButtonGroupButton
                        title="Redo"
                        disabled={!history.hasRedo}
                        onClick={useCallback(() => {
                            redoHistory();
                        }, [redoHistory])}
                    >
                        <i className="fas fa-rotate-right" />
                    </ButtonGroupButton>
                </ButtonGroup>
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
