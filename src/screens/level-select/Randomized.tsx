import "./Randomized.less";

import { forwardRef, useState } from "react";

import { StateKind } from "src/AppState";
import { generateLevel } from "src/algorithms/generate";
import { SizeGridWithSize } from "src/components/size-grid/SizeGrid";
import { IconButton } from "src/components/ui/button/Button";

import { CardProps } from "./Card";

export const Randomized = forwardRef<HTMLDivElement, CardProps>(
    ({ setState, className = "" }, ref) => {
        const [width, setWidth] = useState(10);
        const [height, setHeight] = useState(10);

        return (
            <div
                className={className + " level-select-screen__randomized"}
                ref={ref}
            >
                <SizeGridWithSize
                    maxWidth={25}
                    width={width}
                    setWidth={setWidth}
                    maxHeight={25}
                    height={height}
                    setHeight={setHeight}
                    scale={5}
                />
                <IconButton
                    icon="fas fa-play"
                    title="Play"
                    alwaysShowTitle={true}
                    onClick={() =>
                        setState({
                            kind: StateKind.Play,
                            level: {
                                id: null,
                                name: "Randomized level",
                                ...generateLevel(width, height),
                            },
                        })
                    }
                />
            </div>
        );
    },
);
