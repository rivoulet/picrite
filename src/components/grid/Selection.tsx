export type Selection = [number, number];
export type SelectionOrNull = Selection | null;

export const enum SelectionUpdateKind {
    Focus,
    NavStart,
    NavMove,
    DragStart,
    DragMove,
}

export interface SelectionUpdateNonNull {
    selection: Selection;
    kind: SelectionUpdateKind;
}

export type SelectionUpdate = SelectionUpdateNonNull | null;

export type SetSelectionAction =
    | SelectionUpdate
    | ((prevSelection: SelectionOrNull) => SelectionUpdate);
