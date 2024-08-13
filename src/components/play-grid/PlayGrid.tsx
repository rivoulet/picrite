import "./PlayGrid.less";

import { SelectableGridWithTouchInput } from "../grid/Grid";
import { LevelDimensions, LoadedLevelLines } from "../../Level";
import { CellMark } from "../../CellMark";
import {
    Dispatch,
    MutableRefObject,
    UIEvent,
    useCallback,
    useMemo,
} from "react";
import { NumbersMemo } from "../numbers/Numbers";
import { useSyncedScroll } from "../../utils";
import { Selection, SetSelectionAction } from "../grid/Selection";

export interface PlayGridProps {
    level: LevelDimensions & LoadedLevelLines;
    marks: CellMark[];
    selection: Selection;
    setSelection: Dispatch<SetSelectionAction>;
    className?: string;
}

function borderExtLines(size: number, selection: number) {
    const lines = new Array(size);
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

    return (
        <div className={className + " play-grid"}>
            <div className="play-grid__selection-cover play-grid__selection-cover--left" />
            <div className="play-grid__selection-cover play-grid__selection-cover--top" />
            <div
                className="play-grid__numbers-border-ext play-grid__numbers-border-ext--v"
                onScroll={useCallback(
                    (e: UIEvent) => {
                        if (wasScrolledByUser(0)) {
                            const target = e.target as HTMLElement;
                            const x = target.scrollLeft;
                            scroll(2, x, false);
                            scroll(4, x, false);
                        }
                    },
                    [wasScrolledByUser, scroll]
                )}
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
                onScroll={useCallback(
                    (e: UIEvent) => {
                        if (wasScrolledByUser(1)) {
                            const target = e.target as HTMLElement;
                            const y = target.scrollTop;
                            scroll(3, y, true);
                            scroll(4, y, true);
                        }
                    },
                    [wasScrolledByUser, scroll]
                )}
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
                selection={selection ? selection[0] : -1}
                className="play-grid__numbers play-grid__numbers--v"
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
                        .current[2] as unknown as MutableRefObject<HTMLOListElement>
                }
            />
            <NumbersMemo
                isVertical={false}
                level={level}
                selection={selection ? selection[1] : -1}
                className="play-grid__numbers play-grid__numbers--h"
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
                        .current[3] as unknown as MutableRefObject<HTMLOListElement>
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
                scrollContainerRef={syncedScrollElementsRef.current[4]}
            />
        </div>
    );
}
