import "./App.less";

import { useState } from "react";
import { LevelSelect } from "./screens/level-select/LevelSelect";
import { PlayScreen } from "./screens/play/Play";
import { SwitchTransition } from "react-transition-group";
import { Slide } from "./components/transitions/Slide";
import { SlideDir } from "./components/transitions/SlideDir";
import { AppState, EditState } from "./AppState";
import { EditScreen } from "./screens/edit/Edit";

export function App() {
    const [state, setState] = useState<AppState>({ level: null });

    let screen;
    if (state.level) {
        if (state.isEditing) {
            screen = (
                <EditScreen
                    key="edit"
                    level={state.level}
                    savedCells={state.savedCells}
                    saveLevel={(cells) => {
                        setState((state_) => {
                            const state = state_ as EditState;
                            const level = { ...state.level, cells };
                            state.saveLevel(cells);
                            return {
                                ...state,
                                level,
                                savedCells: cells,
                            };
                        });
                    }}
                    close={() => setState({ level: null })}
                    className="screen"
                />
            );
        } else {
            screen = (
                <PlayScreen
                    key="play"
                    level={state.level}
                    quit={(_winTime) => setState({ level: null })}
                    className="screen"
                />
            );
        }
    } else {
        screen = (
            <LevelSelect
                key="level-select"
                setState={setState}
                className="screen"
            />
        );
    }

    return (
        <SwitchTransition>
            <Slide key={screen.key!} dir={SlideDir.Down}>
                {screen}
            </Slide>
        </SwitchTransition>
    );
}
