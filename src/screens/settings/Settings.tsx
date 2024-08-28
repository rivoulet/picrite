import "./Settings.less";

import { Dispatch, SetStateAction, forwardRef, useContext } from "react";

import { AppState, StateKind } from "src/AppState";
import { SettingsStoreContext } from "src/components/settings-store/SettingsStore";
import { IconButton } from "src/components/ui/button/Button";
import { Toggle } from "src/components/ui/toggle/Toggle";

export interface SettingsScreenProps {
    setState: Dispatch<SetStateAction<AppState>>;
    className?: string | undefined;
}

export const SettingsScreen = forwardRef<HTMLDivElement, SettingsScreenProps>(
    ({ setState, className }, ref) => {
        const { settings, setSettings } = useContext(SettingsStoreContext)!;

        const close = () => setState({ kind: StateKind.LevelSelect });

        return (
            <div className={className + " settings-screen"} ref={ref}>
                <div className="settings-screen__settings">
                    <Toggle
                        checked={settings.showPlayTimer}
                        onChange={(e) =>
                            setSettings((settings) => {
                                return {
                                    ...settings,
                                    showPlayTimer: e.target.checked,
                                };
                            })
                        }
                    />
                    <div className="settings-screen__setting__label">
                        Show play timer
                    </div>
                    <Toggle
                        checked={settings.showAllTitles}
                        onChange={(e) =>
                            setSettings((settings) => {
                                return {
                                    ...settings,
                                    showAllTitles: e.target.checked,
                                };
                            })
                        }
                    />
                    <div className="settings-screen__setting__label">
                        Show all button titles
                    </div>
                </div>
                <IconButton
                    icon="fas fa-xmark"
                    title="Close"
                    alwaysShowTitle={true}
                    onClick={close}
                    className="settings-screen__close"
                />
            </div>
        );
    },
);
