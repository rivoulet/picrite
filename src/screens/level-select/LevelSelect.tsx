import "./LevelSelect.less";

import { forwardRef, useCallback, useState } from "react";
import { generateLevel } from "../../algorithms/generate";
import { Button } from "../../components/ui/button/Button";
import { LoadedLevel } from "../../Level";
import { SizeGrid } from "../../components/size-grid/SizeGrid";

export interface LevelSelectProps {
    setLevel: (level: LoadedLevel) => void;
}

export const LevelSelect = forwardRef<HTMLDivElement, LevelSelectProps>(
    ({ setLevel }, ref) => {
        const [width, setWidth] = useState(10);
        const [height, setHeight] = useState(10);
        return (
            <div className="level-select-screen" ref={ref}>
                <SizeGrid
                    maxWidth={5}
                    width={width / 5}
                    setWidth={useCallback((width) => setWidth(width * 5), [])}
                    maxHeight={5}
                    height={height / 5}
                    setHeight={useCallback(
                        (height) => setHeight(height * 5),
                        []
                    )}
                />
                <p>
                    {width} x {height}
                </p>
                <Button
                    onClick={() => {
                        setLevel(generateLevel(width, height));
                    }}
                >
                    Generate
                </Button>
            </div>
        );
    }
);
