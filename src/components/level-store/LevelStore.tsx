import { useCallback, useMemo } from "react";

import { createLocalStore } from "src/utils/localStorage";

export interface LevelStore {
    levels: { [uuid: string]: string };
    setLevel: (uuid: string, level: string | null) => void;
}

export const [LevelStoreContext, LevelStoreContextProvider] = createLocalStore(
    "levels",
    {} as {
        [uuid: string]: string;
    },
    (levels, setLevels) => {
        const setLevel = useCallback((uuid: string, level: string | null) => {
            setLevels((levels) => {
                const newLevels = { ...levels };
                if (level === null) {
                    delete newLevels[uuid];
                } else {
                    newLevels[uuid] = level;
                }
                return newLevels;
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return useMemo(() => {
            return {
                levels,
                setLevel,
            };
        }, [levels, setLevel]);
    },
);
