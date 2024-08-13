export type Selection = [number, number] | null;

export const enum SelectionUpdateKind {
    NavStart,
    NavMove,
    DragStart,
    DragMove,
}

export interface SelectionUpdate {
    selection: Selection;
    kind: SelectionUpdateKind;
}

export type SetSelectionAction =
    | SelectionUpdate
    | ((prevSelection: Selection) => SelectionUpdate);
