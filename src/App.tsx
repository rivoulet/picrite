import "./App.less";

import { useEffect, useState } from "react";
import { SwitchTransition } from "react-transition-group";

import { AppState } from "src/AppState";
import { LevelStoreContextProvider } from "src/components/level-store/LevelStore";
import { Slide } from "src/components/transitions/Slide";
import { SlideDir } from "src/components/transitions/SlideDir";
import { ShowTitlesContext } from "src/components/ui/show-titles/ShowTitles";
import { EditScreen } from "src/screens/edit/Edit";
import { LevelSelect } from "src/screens/level-select/LevelSelect";
import { PlayScreen } from "src/screens/play/Play";

import { levelNumbers } from "./algorithms/numbers";
import { unpackLevel, unpackLevelCells } from "./algorithms/pack";

export function App() {
    const [state, setState] = useState<AppState>(() => {
        const url = new URL(location.href);
        const id = url.searchParams.get("id");
        const data = url.searchParams.get("data");
        if (id && data) {
            const [levelInfo, packedCells] = unpackLevel(
                decodeURIComponent(data),
                id,
                false,
            );
            const cells = unpackLevelCells(packedCells, levelInfo);
            const level = {
                ...levelInfo,
                cells,
            };
            return {
                isEditing: false,
                level: {
                    ...level,
                    ...levelNumbers(level),
                },
            };
        }
        return { level: null };
    });

    let screen;
    if (state.level) {
        if (state.isEditing) {
            screen = (
                <EditScreen
                    key="edit"
                    level={state.level}
                    savedCells={state.savedCells}
                    saveLevel={(cells) => {
                        const level = { ...state.level, cells };
                        setState({
                            ...state,
                            level,
                            savedCells: cells,
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
                    quit={() => setState({ level: null })}
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
        <ShowTitlesContext.Provider value={true}>
            <LevelStoreContextProvider>
                <SwitchTransition>
                    <Slide key={screen.key!} dir={SlideDir.Down}>
                        {screen}
                    </Slide>
                </SwitchTransition>
            </LevelStoreContextProvider>
        </ShowTitlesContext.Provider>
    );
}
