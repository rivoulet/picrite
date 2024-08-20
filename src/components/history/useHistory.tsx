import { KeyboardEvent, useCallback, useState } from "react";
import { CellValue } from "../../CellValue";
import { Change, History, HistoryActions } from "./History";

// TODO: Make configurable
const MAX_LENGTH = 128;

export function useHistory<V extends CellValue>(
    cells: V[],
    setCell: (i: number, value: V) => void
): History & HistoryActions<V> {
    const [history, setHistory] = useState({
        changes: [] as Change<V>[],
        pos: 0,
    });

    const add = useCallback((change: Change<V>) => {
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
            setCell(change.i, change.prev);
            setHistory({
                ...history,
                pos: history.pos + 1,
            });
        }, [history, setCell]),
        hasRedo: history.pos > 0,
        redo: useCallback(() => {
            const change =
                history.changes[history.changes.length - history.pos];
            setCell(change.i, change.next);
            setHistory({
                ...history,
                pos: history.pos - 1,
            });
        }, [history, setCell]),
        clear: useCallback(() => {
            setHistory({
                changes: [] as Change<V>[],
                pos: 0,
            });
        }, []),
        setCell: useCallback(
            (i: number, value: V) => {
                add({
                    i,
                    prev: cells[i],
                    next: value,
                });
                setCell(i, value);
            },
            [cells, setCell, add]
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
