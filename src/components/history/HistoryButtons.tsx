import { ButtonGroup } from "../ui/button-group/ButtonGroup";
import { Button } from "../ui/button/Button";
import { History } from "./History";

export interface HistoryButtonsProps {
    history: History;
}

export function HistoryButtons({
    history: { hasUndo, undo, hasRedo, redo },
}: HistoryButtonsProps) {
    return (
        <ButtonGroup>
            <Button
                icon="fas fa-rotate-left"
                title="Undo"
                disabled={!hasUndo}
                onClick={undo}
            />
            <Button
                icon="fas fa-rotate-right"
                title="Redo"
                disabled={!hasRedo}
                onClick={redo}
            />
        </ButtonGroup>
    );
}
