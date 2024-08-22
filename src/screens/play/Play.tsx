import "./Play.less";

import { forwardRef, useCallback, useMemo, useState } from "react";
import { CellMark } from "../../CellValue";
import { PlayGridMemo } from "../../components/play-grid/PlayGrid";
import { LevelCells, LevelDimensions, LoadedLevelNumbers } from "../../Level";
import { useInput } from "./Input";
import { levelIsSolved } from "../../algorithms/utils";
import { Button } from "../../components/ui/button/Button";
import {
    useHistory,
    useHistoryInput,
} from "../../components/history/useHistory";
import { RadioButtons } from "../../components/ui/radio-buttons/RadioButtons";
import { SelectionOrNull } from "../../components/grid/Selection";
import { HistoryButtons } from "../../components/history/HistoryButtons";
import { ZoomButtons } from "../../components/zoom-buttons/ZoomButtons";
import { Custom } from "../../components/transitions/Custom";
import { PauseScreen } from "./Pause";

function clearMarks(level: LevelDimensions) {
    return new Array<CellMark>(level.width * level.height).fill(CellMark.Empty);
}

export interface PlayScreenProps {
    level: LevelDimensions & LevelCells & LoadedLevelNumbers;
    onWin: () => void;
    quit: () => void;
    className?: string | undefined;
}

export const PlayScreen = forwardRef<HTMLDivElement, PlayScreenProps>(
    ({ level, onWin, quit, className }, ref) => {
        // NOTE: level is assumed not to change

        const [isPaused, setIsPaused] = useState(false);

        const [marks, setMarks] = useState(() => clearMarks(level));

        const [selection, setSelectionRaw] = useState<SelectionOrNull>(null);

        const [isCrossing, setIsCrossing] = useState(false);
        const [scale, setScale] = useState(1);

        const setMarkRaw = useCallback(
            (i: number, mark: CellMark) => {
                setSelectionRaw((selection) =>
                    !selection ||
                    i !== selection[1] * level.width + selection[0]
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

        const { setCell: setMark, ...history } = useHistory(marks, setMarkRaw);

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
            <div className={className + " play-screen"} ref={ref}>
                <Custom
                    classNames="play-screen__inner--pause"
                    in={isPaused}
                    timeout={1000}
                >
                    <div
                        className="play-screen__inner"
                        onKeyDown={(e) => {
                            inputOnKeyDown(e);
                            historyOnKeyDown(e);
                        }}
                    >
                        <style>
                            {".play-screen__grid { font-size: " +
                                scale +
                                "em; }"}
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
                                setSelected={(selected) =>
                                    setIsCrossing(selected > 0)
                                }
                                name="mark-cross"
                                hasKeyboardControls={false}
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
                            />
                            <ZoomButtons scale={scale} setScale={setScale} />
                            <HistoryButtons history={history} />
                            <Button
                                title="Pause"
                                onClick={useCallback(() => {
                                    setIsPaused(true);
                                }, [])}
                            >
                                <i className="fas fa-pause" />
                            </Button>
                        </div>
                    </div>
                </Custom>
                <Custom
                    classNames="play-screen__pause--pause"
                    in={isPaused}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <div className="play-screen__pause">
                        <div className="play-screen__pause__bg" />
                        <PauseScreen
                            clear={useCallback(() => {
                                setMarks(clearMarks(level));
                                history.clear();
                                setIsPaused(false);
                            }, [level, history])}
                            quit={quit}
                            resume={useCallback(() => {
                                setIsPaused(false);
                            }, [])}
                            className="play-screen__pause__inner"
                        />
                    </div>
                </Custom>
            </div>
        );
    }
);
