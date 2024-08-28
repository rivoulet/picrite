import { ShowTitlesContext } from "../ui/show-titles/ShowTitles";
import {
    Dispatch,
    PropsWithChildren,
    ReactNode,
    SetStateAction,
    useContext,
    useMemo,
} from "react";

import { createLocalStore } from "src/utils/localStorage";

export interface Settings {
    showPlayTimer: boolean;
    showAllTitles: boolean;
}

export interface SettingsStore {
    settings: Settings;
    setSettings: Dispatch<SetStateAction<Settings>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const [SettingsStoreContext, SettingsStoreContextProvider] =
    createLocalStore<Settings, SettingsStore>(
        "settings",
        {
            showPlayTimer: true,
            showAllTitles: true,
        },
        (settings, setSettings) => {
            return useMemo(() => {
                return {
                    settings,
                    setSettings,
                };
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [settings]);
        },
    );

export interface SettingsStoreContextProviderProps {
    children?: ReactNode | undefined;
}

export function ApplySettingContexts({ children }: PropsWithChildren) {
    const { settings } = useContext(SettingsStoreContext)!;

    return (
        <ShowTitlesContext.Provider value={settings.showAllTitles}>
            {children}
        </ShowTitlesContext.Provider>
    );
}
