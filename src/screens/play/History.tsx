import { useCallback, useState } from "react";
import { CellMark } from "../../CellMark";
import { LevelDimensions } from "../../Level";

export interface Change {
    i: number;
    prev: CellMark;
    next: CellMark;
}

export interface History {
    hasUndo: boolean;
    undo(): void;
    hasRedo: boolean;
    redo(): void;
    clear(): void;
    add(change: Change): void;
}

// TODO: Make configurable
const MAX_LENGTH = 128;

export function useHistory(
    level: LevelDimensions,
    setMark: (i: number, mark: CellMark) => void
): History {
    const [history, setHistory] = useState({
        changes: [] as Change[],
        pos: 0,
    });

    return {
        hasUndo: history.pos < history.changes.length,
        undo: useCallback(() => {
            const change =
                history.changes[history.changes.length - 1 - history.pos];
            setMark(change.i, change.prev);
            setHistory({
                ...history,
                pos: history.pos + 1,
            });
        }, [history, setMark]),
        hasRedo: history.pos > 0,
        redo: useCallback(() => {
            const change =
                history.changes[history.changes.length - history.pos];
            setMark(change.i, change.next);
            setHistory({
                ...history,
                pos: history.pos - 1,
            });
        }, [history, setMark]),
        clear: useCallback(() => {
            setHistory({
                changes: [] as Change[],
                pos: 0,
            });
        }, []),
        add: useCallback((change: Change) => {
            setHistory((history) => {
                const endIndex = history.changes.length - history.pos;
                return {
                    changes: [
                        ...history.changes.slice(
                            Math.max(endIndex - (MAX_LENGTH - 1), 0),
                            endIndex
                        ),
                        change,
                    ],
                    pos: 0,
                };
            });
        }, []),
    };
}
