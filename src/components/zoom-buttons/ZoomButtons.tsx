import { Dispatch, SetStateAction, useCallback } from "react";
import { ButtonGroup, ButtonGroupButton } from "../ui/button-group/ButtonGroup";

export interface ZoomButtonsProps {
    scale: number;
    setScale: Dispatch<SetStateAction<number>>;
}

export function ZoomButtons({ scale, setScale }: ZoomButtonsProps) {
    return (
        <ButtonGroup>
            <ButtonGroupButton
                title="Zoom in"
                disabled={scale >= 1.5 * 1.5 * 1.5}
                onClick={useCallback(
                    () => setScale((scale) => Math.min(scale * 1.5, 4)),
                    [setScale]
                )}
            >
                <i className="fas fa-plus" />
            </ButtonGroupButton>
            <ButtonGroupButton
                title="Zoom out"
                disabled={scale <= 1 / (1.5 * 1.5 * 1.5)}
                onClick={useCallback(
                    () => setScale((scale) => Math.max(scale / 1.5, 1 / 4)),
                    [setScale]
                )}
            >
                <i className="fas fa-minus" />
            </ButtonGroupButton>
        </ButtonGroup>
    );
}
