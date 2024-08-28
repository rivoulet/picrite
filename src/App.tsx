import "./App.less";

import { useState } from "react";
import { SwitchTransition } from "react-transition-group";

import { AppState, StateKind } from "src/AppState";
import { LevelStoreContextProvider } from "src/components/level-store/LevelStore";
import { Slide } from "src/components/transitions/Slide";
import { SlideDir } from "src/components/transitions/SlideDir";
import { EditScreen } from "src/screens/edit/Edit";
import { LevelSelectScreen } from "src/screens/level-select/LevelSelect";
import { PlayScreen } from "src/screens/play/Play";
import { SharedInfoScreen } from "src/screens/shared-info/SharedInfo";
import { sharedLevel } from "src/sharedLevel";

import {
    ApplySettingContexts,
    SettingsStoreContextProvider,
} from "./components/settings-store/SettingsStore";
import { SettingsScreen } from "./screens/settings/Settings";

export function App() {
    const [state, setState] = useState<AppState>(() => {
        return sharedLevel
            ? {
                  kind: StateKind.SharedInfo,
                  level: sharedLevel,
              }
            : {
                  kind: StateKind.LevelSelect,
              };
    });

    let screen;
    switch (state.kind) {
        case StateKind.LevelSelect: {
            screen = (
                <LevelSelectScreen
                    key="level-select"
                    setState={setState}
                    className="screen"
                />
            );
            break;
        }

        case StateKind.Play: {
            screen = (
                <PlayScreen
                    key="play"
                    level={state.level}
                    quit={() => setState({ kind: StateKind.LevelSelect })}
                    className="screen"
                />
            );
            break;
        }

        case StateKind.Edit: {
            screen = (
                <EditScreen
                    key="edit"
                    level={state.level}
                    saveLevel={(cells) => {
                        const level = { ...state.level, cells };
                        setState({
                            ...state,
                            level,
                        });
                    }}
                    close={() => setState({ kind: StateKind.LevelSelect })}
                    className="screen"
                />
            );
            break;
        }

        case StateKind.SharedInfo: {
            screen = (
                <SharedInfoScreen
                    key="shared-info"
                    level={state.level}
                    setState={setState}
                    className="screen"
                />
            );
            break;
        }

        case StateKind.Settings: {
            screen = (
                <SettingsScreen
                    key="settings"
                    setState={setState}
                    className="screen"
                />
            );
            break;
        }
    }

    return (
        <SettingsStoreContextProvider>
            <ApplySettingContexts>
                <LevelStoreContextProvider>
                    <SwitchTransition>
                        <Slide key={screen.key!} dir={SlideDir.Down}>
                            {screen}
                        </Slide>
                    </SwitchTransition>
                </LevelStoreContextProvider>
            </ApplySettingContexts>
        </SettingsStoreContextProvider>
    );
}
