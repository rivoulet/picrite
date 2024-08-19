import "./PlayGrid.less";

import { SelectableGridWithTouchInput } from "../grid/Grid";
import { LevelDimensions, LoadedLevelNumbers } from "../../Level";
import { CellMark } from "../../CellMark";
import {
    Dispatch,
    memo,
    ReactElement,
    RefObject,

    useCallback,
    useMemo,
    useRef,
} from "react";
import { NumbersMemo } from "../numbers/Numbers";
import { useSyncedScroll } from "../../utils/useSyncedScroll";
import { SelectionOrNull, SetSelectionAction } from "../grid/Selection";
import { useInput } from "./hooks";

export interface PlayGridProps {
    level: LevelDimensions & LoadedLevelNumbers;
    marks: CellMark[];
    selection: SelectionOrNull;
    setSelection: Dispatch<SetSelectionAction>;
    className?: string | undefined;
}

function borderExtLines(size: number, selection: number) {
    const lines = new Array<ReactElement>(size);
    for (let i = 0; i < size; i++) {
        lines[i] = (
            <div
                key={i}
                className={
                    "play-grid__numbers-border-ext__line" +
                    (selection === i
                        ? " play-grid__numbers-border-ext__line--selected"
                        : "")
                }
            />
        );
    }
    return lines;
}

export function PlayGrid({
    level,
    marks,
    selection,
    setSelection,
    className = "",
}: PlayGridProps) {
    const {
        elementsRef: syncedScrollElementsRef,
        wasScrolledByUser,
        scroll,
    } = useSyncedScroll<HTMLDivElement>(5);

    const tableRef = useRef<HTMLTableElement>(null);

    const { onKeyDown, onBlur } = useInput(selection, setSelection, tableRef);

    return (
        <div
            className={className + " play-grid"}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
        >
            <div className="play-grid__selection-cover play-grid__selection-cover--left" />
            <div className="play-grid__selection-cover play-grid__selection-cover--top" />
            <div
                className="play-grid__numbers-border-ext play-grid__numbers-border-ext--v"
                tabIndex={-1}
                onScroll={(e) => {
                    if (wasScrolledByUser(0)) {
                        const target = e.target as HTMLElement;
                        const x = target.scrollLeft;
                        scroll(2, x, false);
                        scroll(4, x, false);
                    }
                }}
                ref={syncedScrollElementsRef.current[0]}
            >
                {...useMemo(
                    () =>
                        borderExtLines(
                            level.width,
                            selection ? selection[0] : -1
                        ),
                    [level.width, selection]
                )}
            </div>
            <div
                className="play-grid__numbers-border-ext play-grid__numbers-border-ext--h"
                tabIndex={-1}
                onScroll={(e) => {
                    if (wasScrolledByUser(1)) {
                        const target = e.target as HTMLElement;
                        const y = target.scrollTop;
                        scroll(3, y, true);
                        scroll(4, y, true);
                    }
                }}
                ref={syncedScrollElementsRef.current[1]}
            >
                {...useMemo(
                    () =>
                        borderExtLines(
                            level.height,
                            selection ? selection[1] : -1
                        ),
                    [level.height, selection]
                )}
            </div>
            <NumbersMemo
                isVertical={true}
                level={level}
                marks={marks}
                selection={selection ? selection[0] : -1}
                className="play-grid__numbers play-grid__numbers--v"
                tabIndex={-1}
                onScroll={useCallback(
                    (x) => {
                        if (wasScrolledByUser(2)) {
                            scroll(0, x, false);
                            scroll(4, x, false);
                        }
                    },
                    [wasScrolledByUser, scroll]
                )}
                innerRef={
                    syncedScrollElementsRef
                        .current[2] as unknown as RefObject<HTMLOListElement>
                }
            />
            <NumbersMemo
                isVertical={false}
                level={level}
                marks={marks}
                selection={selection ? selection[1] : -1}
                className="play-grid__numbers play-grid__numbers--h"
                tabIndex={-1}
                onScroll={useCallback(
                    (y) => {
                        if (wasScrolledByUser(3)) {
                            scroll(1, y, true);
                            scroll(4, y, true);
                        }
                    },
                    [wasScrolledByUser, scroll]
                )}
                innerRef={
                    syncedScrollElementsRef
                        .current[3] as unknown as RefObject<HTMLOListElement>
                }
            />
            <SelectableGridWithTouchInput
                width={level.width}
                height={level.height}
                marks={marks}
                selection={selection}
                setSelection={setSelection}
                autoFocus={true}
                className="play-grid__grid"
                tabIndex={0}
                scrollContainerTabIndex={-1}
                onScroll={useCallback(
                    (x, y) => {
                        if (wasScrolledByUser(4)) {
                            scroll(0, x, false);
                            scroll(1, y, true);
                            scroll(2, x, false);
                            scroll(3, y, true);
                        }
                    },
                    [wasScrolledByUser, scroll]
                )}
                tableRef={tableRef}
                scrollContainerRef={syncedScrollElementsRef.current[4]}
            />
        </div>
    );
}

export const PlayGridMemo = memo(PlayGrid);
