import "./Edit.less";

import {
    Dispatch,
    forwardRef,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import { LevelCells } from "../../Level";
import { SelectableGridWithInput } from "../../components/grid/Grid";
import { SelectionOrNull } from "../../components/grid/Selection";
import {
    useHistory,
    useHistoryInput,
} from "../../components/history/useHistory";
import { useInput } from "./Input";
import { Button } from "../../components/ui/button/Button";
import { HistoryButtons } from "../../components/history/HistoryButtons";
import { levelIsSolvable } from "../../algorithms/solve";
import { levelNumbers } from "../../algorithms/numbers";
import { ZoomButtons } from "../../components/zoom-buttons/ZoomButtons";
import { useOuterInput } from "../../components/grid/hooks";
import { equalArrays } from "../../utils";

export interface EditScreenProps {
    level: LevelCells;
    savedCells?: boolean[] | undefined;
    saveLevel: Dispatch<boolean[]>;
    close: () => void;
    className?: string | undefined;
}

export const EditScreen = forwardRef<HTMLDivElement, EditScreenProps>(
    ({ level, savedCells = level.cells, saveLevel, close, className }, ref) => {
        // NOTE: level is assumed not to change

        const [cells, setCells] = useState(() => level.cells.slice());

        const [selection, setSelectionRaw] = useState<SelectionOrNull>(null);

        const [scale, setScale] = useState(1);

        const gridTableRef = useRef<HTMLTableElement>(null);

        const isSolvable = useMemo(() => {
            const level_ = {
                ...level,
                cells,
            };
            return levelIsSolvable({
                ...level_,
                ...levelNumbers(level_),
            });
        }, [level, cells]);

        const isUnchanged = useMemo(
            () => equalArrays(savedCells, cells),
            [savedCells, cells]
        );

        const setCellRaw = useCallback(
            (i: number, value: boolean) => {
                setSelectionRaw((selection) =>
                    !selection ||
                    i !== selection[1] * level.width + selection[0]
                        ? [i % level.width, Math.floor(i / level.width)]
                        : selection
                );
                setCells((cells) => {
                    const newCells = cells.slice();
                    newCells[i] = value;
                    return newCells;
                });
            },
            [level.width]
        );

        const { setCell, ...history } = useHistory(cells, setCellRaw);

        const { setSelection, onKeyDown: inputOnKeyDown } = useInput(
            cells,
            setCell,
            selection,
            setSelectionRaw,
            level
        );

        const { onKeyDown: historyOnKeyDown } = useHistoryInput(history);

        const { onKeyDown: gridOnKeyDown, onBlur: gridOnBlur } = useOuterInput(
            selection,
            setSelection,
            gridTableRef
        );

        return (
            <div
                className={className + " edit-screen"}
                onKeyDown={(e) => {
                    inputOnKeyDown(e);
                    historyOnKeyDown(e);
                }}
                ref={ref}
            >
                <style>
                    {".edit-screen__grid { font-size: " + scale + "em; }"}
                </style>
                <div
                    className="edit-screen__grid"
                    onKeyDown={gridOnKeyDown}
                    onBlur={gridOnBlur}
                >
                    <SelectableGridWithInput
                        width={level.width}
                        height={level.height}
                        cells={cells}
                        selection={selection}
                        setSelection={setSelection}
                        autoFocus={true}
                        className="edit-screen__grid__inner"
                        tabIndex={0}
                        scrollContainerTabIndex={-1}
                        tableRef={gridTableRef}
                    />
                </div>
                <div className="edit-screen__controls">
                    <ZoomButtons scale={scale} setScale={setScale} />
                    <HistoryButtons history={history} />
                    <Button
                        icon="fas fa-save"
                        title="Save"
                        onClick={() => saveLevel(cells)}
                        disabled={!isSolvable || isUnchanged}
                        className="edit-screen__controls__save"
                    >
                        {isSolvable ? null : (
                            <span className="edit-screen__controls__save__not-solvable">
                                Not solvable
                            </span>
                        )}
                    </Button>
                    <Button
                        icon="fas fa-xmark"
                        title="Close"
                        onClick={() => {
                            if (
                                isUnchanged ||
                                confirm(
                                    "You have unsaved changes. Do you want to close this level?"
                                )
                            ) {
                                close();
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
);
