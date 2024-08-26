import "./Create.less";

import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { AppState, StateKind } from "src/AppState";
import { SolvedState } from "src/Level";
import { generateBlankCells, generateLevel } from "src/algorithms/generate";
import { SizeGridWithSize } from "src/components/size-grid/SizeGrid";
import { ButtonGroup } from "src/components/ui/button-group/ButtonGroup";
import { Button } from "src/components/ui/button/Button";
import { RadioButtons } from "src/components/ui/radio-buttons/RadioButtons";

export interface CreateProps {
    setState: Dispatch<SetStateAction<AppState>>;
    back: () => void;
    className?: string | undefined;
}

export function Create({ setState, back, className = "" }: CreateProps) {
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [isRandomized, setIsRandomized] = useState(false);
    const [name, setName] = useState("");

    return (
        <div className={className + " level-create"}>
            <div className="level-create__options">
                <SizeGridWithSize
                    maxWidth={25}
                    width={width}
                    setWidth={setWidth}
                    maxHeight={25}
                    height={height}
                    setHeight={setHeight}
                    scale={5}
                    className="level-create__options__size"
                />
                <div className="level-create__options__aside">
                    <div className="level-create__options__aside__name">
                        <input
                            type="text"
                            value={name}
                            placeholder="Name"
                            className="level-create__options__aside__name__input"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <RadioButtons
                        selected={+isRandomized}
                        setSelected={useCallback(
                            (newSelected) => setIsRandomized(!!newSelected),
                            [],
                        )}
                        name="blank-randomized"
                        buttons={["Blank", "Randomized"]}
                    />
                </div>
            </div>
            <ButtonGroup className="level-create__buttons">
                <Button onClick={back}>Back</Button>
                <Button
                    onClick={() => {
                        const trimmedName = name.trim();
                        const level = {
                            id: uuidv4(),
                            name: trimmedName ? trimmedName : "Unnamed",
                            solved: SolvedState.Own,
                            record: null,
                            width,
                            height,
                            cells: isRandomized
                                ? generateLevel(width, height).cells
                                : generateBlankCells(width, height),
                        };
                        setState({
                            kind: StateKind.Edit,
                            level,
                        });
                    }}
                >
                    Create
                </Button>
            </ButtonGroup>
        </div>
    );
}
