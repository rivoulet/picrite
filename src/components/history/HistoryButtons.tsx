import { ButtonGroup } from "src/components/ui/button-group/ButtonGroup";
import { IconButton } from "src/components/ui/button/Button";

import { History } from "./History";

export interface HistoryButtonsProps {
    history: History;
}

export function HistoryButtons({
    history: { hasUndo, undo, hasRedo, redo },
}: HistoryButtonsProps) {
    return (
        <ButtonGroup>
            <IconButton
                icon="fas fa-rotate-left"
                title="Undo"
                disabled={!hasUndo}
                onClick={undo}
            />
            <IconButton
                icon="fas fa-rotate-right"
                title="Redo"
                disabled={!hasRedo}
                onClick={redo}
            />
        </ButtonGroup>
    );
}
