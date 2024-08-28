import "./Play.less";

import {
    forwardRef,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";

import { CellMark } from "src/CellValue";
import {
    LevelCells,
    LevelInfo,
    LevelNumbers,
    LevelSize,
    SolvedState,
} from "src/Level";
import { packLevel } from "src/algorithms/pack";
import { levelIsSolved } from "src/algorithms/utils";
import { SelectionOrNull } from "src/components/grid/Selection";
import { HistoryButtons } from "src/components/history/HistoryButtons";
import { useHistory, useHistoryInput } from "src/components/history/useHistory";
import { LevelStoreContext } from "src/components/level-store/LevelStore";
import { Modal, ModalTarget } from "src/components/modal/Modal";
import { PlayGrid } from "src/components/play-grid/PlayGrid";
import { Time } from "src/components/time/Time";
import { IconButton } from "src/components/ui/button/Button";
import { RadioButtons } from "src/components/ui/radio-buttons/RadioButtons";
import { ZoomButtons } from "src/components/zoom-buttons/ZoomButtons";
import { equalArrays } from "src/utils";
import { useTimer } from "src/utils/useTimer";

import { useInput } from "./Input";
import { PauseScreen } from "./Pause";
import { WinScreen } from "./Win";

function clearMarks(level: LevelSize) {
    return new Array<CellMark>(level.width * level.height).fill(CellMark.Empty);
}

export interface PlayScreenProps {
    level: LevelInfo & LevelCells & LevelNumbers;
    quit: () => void;
    className?: string | undefined;
}

export const PlayScreen = forwardRef<HTMLDivElement, PlayScreenProps>(
    ({ level, quit, className }, ref) => {
        // NOTE: level is assumed not to change

        const [marks, setMarks] = useState(() => clearMarks(level));

        const marksAreClear = useMemo(
            () => equalArrays(marks, clearMarks(level)),
            [marks, level],
        );

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

        const { setLevel: setSavedLevel } = useContext(LevelStoreContext)!;
        if (level.id !== null && hasWon && !prevHasWon) {
            setSavedLevel(
                level.id,
                packLevel(
                    {
                        ...level,
                        solved:
                            level.solved === SolvedState.Unsolved
                                ? SolvedState.Solved
                                : level.solved,
                        record:
                            level.record === null || elapsed < level.record
                                ? elapsed
                                : level.record,
                    },
                    level.cells,
                    true,
                ),
            );
        }

        const setMarkRaw = useCallback(
            (i: number, mark: CellMark) => {
                setSelectionRaw((selection) =>
                    !selection ||
                    i !== selection[1] * level.width + selection[0]
                        ? [i % level.width, Math.floor(i / level.width)]
                        : selection,
                );
                setMarks((marks) => {
                    const newMarks = marks.slice();
                    newMarks[i] = mark;
                    return newMarks;
                });
            },
            [level.width],
        );

        const {
            setCell: setMark,
            clear: clearHistory,
            ...history
        } = useHistory(marks, setMarkRaw);

        const { setSelection, onKeyDown: inputOnKeyDown } = useInput(
            marks,
            setMark,
            selection,
            setSelectionRaw,
            isCrossing,
            setIsCrossing,
            level,
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
                        <PlayGrid
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
                                    setIsCrossing(!!selected)
                                }
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
                            <IconButton
                                icon="fas fa-pause"
                                title="Pause"
                                onClick={() => setIsPaused(true)}
                            />
                        </div>
                    </div>
                </ModalTarget>
                <Modal in={isPaused}>
                    <PauseScreen
                        elapsed={elapsed}
                        level={level}
                        hasClear={!marksAreClear}
                        clear={() => {
                            setMarks(clearMarks(level));
                            clearHistory();
                        }}
                        quit={quit}
                        resume={() => setIsPaused(false)}
                        className="play-screen__modal__inner"
                    />
                </Modal>
                <Modal in={hasWon}>
                    <WinScreen
                        level={level}
                        elapsed={elapsed}
                        quit={quit}
                        className="play-screen__modal__inner"
                    />
                </Modal>
            </div>
        );
    },
);
