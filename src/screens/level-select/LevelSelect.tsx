import "./LevelSelect.less";

import {
    Dispatch,
    forwardRef,
    SetStateAction,
    useCallback,
    useState,
} from "react";
import { generateLevel } from "../../algorithms/generate";
import { Button } from "../../components/ui/button/Button";
import { SizeGrid } from "../../components/size-grid/SizeGrid";
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
