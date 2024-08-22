import "./Play.less";

import { forwardRef, useCallback, useMemo, useRef, useState } from "react";
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
import { PauseScreen } from "./Pause";
import { Time } from "../../components/time/Time";
import { useTimer } from "../../utils/useTimer";
import { WinScreen } from "./Win";
import { Modal, ModalTarget } from "../../components/modal/Modal";

function clearMarks(level: LevelDimensions) {
    return new Array<CellMark>(level.width * level.height).fill(CellMark.Empty);
}

export interface PlayScreenProps {
    level: LevelDimensions & LevelCells & LoadedLevelNumbers;
    quit: (winTime?: number) => void;
    className?: string | undefined;
}

export const PlayScreen = forwardRef<HTMLDivElement, PlayScreenProps>(
    ({ level, quit, className }, ref) => {
        // NOTE: level is assumed not to change

        const [marks, setMarks] = useState(() => clearMarks(level));

        const hasWonRef = useRef(false);
        const prevHasWon = hasWonRef.current;
        const hasWon =
            useMemo(() => levelIsSolved(level, marks), [level, marks]) ||
            prevHasWon;
        hasWonRef.current = hasWon;

        const [selection, setSelectionRaw] = useState<SelectionOrNull>(null);

        const [isCrossing, setIsCrossing] = useState(false);
        const [scale, setScale] = useState(1);

        const [isPaused, setIsPaused] = useState(false);
        const elapsed = useTimer(isPaused || hasWon);

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

        return (
            <div className={className + " play-screen"} ref={ref}>
                <ModalTarget in={isPaused || hasWon}>
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
                        <Time seconds={elapsed} className="play-screen__time" />
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
                </ModalTarget>
                <Modal in={isPaused}>
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
                        className="play-screen__modal__inner"
                    />
                </Modal>
                <Modal in={hasWon}>
                    <WinScreen
                        elapsed={elapsed}
                        quit={quit}
                        className="play-screen__modal__inner"
                    />
                </Modal>
            </div>
        );
    }
);
