import "./LevelSelect.less";

import { Dispatch, SetStateAction, forwardRef, useState } from "react";

import { AppState } from "src/AppState";
import { generateLevel } from "src/algorithms/generate";
import { SizeGridWithSize } from "src/components/size-grid/SizeGrid";
import { Button } from "src/components/ui/button/Button";

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
    },
);
