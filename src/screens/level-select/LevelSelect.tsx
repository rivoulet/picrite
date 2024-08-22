import "./LevelSelect.less";

import { Dispatch, forwardRef, SetStateAction, useState } from "react";
import { generateLevel } from "../../algorithms/generate";
import { Button } from "../../components/ui/button/Button";
import { SizeGridWithSize } from "../../components/size-grid/SizeGrid";
import { AppState } from "../../AppState";

export interface LevelSelectProps {
    setState: Dispatch<SetStateAction<AppState>>;
    className?: string | undefined;
}

export const LevelSelect = forwardRef<HTMLDivElement, LevelSelectProps>(
    ({ setState, className }, ref) => {
        const [width, setWidth] = useState(10);
        const [height, setHeight] = useState(10);
        return (
            <div className={className + " level-select-screen"} ref={ref}>
                <SizeGridWithSize
                    maxWidth={25}
                    width={width}
                    setWidth={setWidth}
                    maxHeight={25}
                    height={height}
                    setHeight={setHeight}
                    scale={5}
                />
                <Button
                    onClick={() => {
                        setState({
                            level: generateLevel(width, height),
                            isEditing: false,
                        });
                    }}
                >
                    Generate
                </Button>
            </div>
        );
    }
);
