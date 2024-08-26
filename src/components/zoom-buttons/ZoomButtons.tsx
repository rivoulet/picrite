import { Dispatch, SetStateAction } from "react";

import { ButtonGroup } from "src/components/ui/button-group/ButtonGroup";
import { IconButton } from "src/components/ui/button/Button";

export interface ZoomButtonsProps {
    scale: number;
    setScale: Dispatch<SetStateAction<number>>;
}

export function ZoomButtons({ scale, setScale }: ZoomButtonsProps) {
    return (
        <ButtonGroup>
            <IconButton
                icon="fas fa-plus"
                title="Zoom in"
                disabled={scale >= 1.5 * 1.5 * 1.5}
                onClick={() => setScale((scale) => Math.min(scale * 1.5, 4))}
            />
            <IconButton
                icon="fas fa-minus"
                title="Zoom out"
                disabled={scale <= 1 / (1.5 * 1.5 * 1.5)}
                onClick={() =>
                    setScale((scale) => Math.max(scale / 1.5, 1 / 4))
                }
            />
        </ButtonGroup>
    );
}
