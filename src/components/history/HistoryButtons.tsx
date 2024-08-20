import { useCallback } from "react";
import { ButtonGroup, ButtonGroupButton } from "../ui/button-group/ButtonGroup";
import { History } from "./History";

export interface HistoryButtonsProps {
    history: History;
}

export function HistoryButtons({
    history: { hasUndo, undo, hasRedo, redo },
}: HistoryButtonsProps) {
    return (
        <ButtonGroup>
            <ButtonGroupButton
                title="Undo"
                disabled={!hasUndo}
                onClick={useCallback(() => {
                    undo();
                }, [undo])}
            >
                <i className="fas fa-rotate-left" />
            </ButtonGroupButton>
            <ButtonGroupButton
                title="Redo"
                disabled={!hasRedo}
                onClick={useCallback(() => {
                    redo();
                }, [redo])}
            >
                <i className="fas fa-rotate-right" />
            </ButtonGroupButton>
        </ButtonGroup>
    );
}
