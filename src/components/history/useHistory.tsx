import { KeyboardEvent, useCallback, useState } from "react";
import { CellMark } from "../../CellMark";
import { Change, History, HistoryActions } from "./History";

// TODO: Make configurable
const MAX_LENGTH = 128;

export function useHistory(
    marks: CellMark[],
    setMark: (i: number, mark: CellMark) => void
): History & HistoryActions {
    const [history, setHistory] = useState({
        changes: [] as Change[],
        pos: 0,
    });

    const add = useCallback((change: Change) => {
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
    }, []);

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
        setMark: useCallback(
            (i: number, mark: CellMark) => {
                add({
                    i,
                    prev: marks[i],
                    next: mark,
                });
                setMark(i, mark);
            },
            [marks, setMark, add]
        ),
    };
}

export function useHistoryInput({ hasUndo, undo, hasRedo, redo }: History) {
    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "z": {
                    if (!(e.metaKey || e.ctrlKey)) break;
                    if (e.shiftKey) {
                        if (hasRedo) {
                            redo();
                        }
                    } else if (hasUndo) {
                        undo();
                    }
                    break;
                }
            }
        },
        [hasRedo, hasUndo, redo, undo]
    );

    return { onKeyDown };
}
