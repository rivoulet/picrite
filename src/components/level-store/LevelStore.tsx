import { ReactNode, createContext, useCallback } from "react";
import { useEffect, useMemo, useState } from "react";

export interface LevelStore {
    levels: { [uuid: string]: string };
    setLevel: (uuid: string, level: string | null) => void;
}

export const LevelStoreContext = createContext<LevelStore | null>(null);

export interface LevelStoreContextProviderProps {
    children?: ReactNode | undefined;
}

export function LevelStoreContextProvider({
    children,
}: LevelStoreContextProviderProps) {
    const [levels, setLevels] = useState(
        () =>
            JSON.parse(localStorage.getItem("levels") ?? "{}") as {
                [uuid: string]: string;
            },
    );

    useEffect(() => {
        localStorage.setItem("levels", JSON.stringify(levels));
    }, [levels]);

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
    }, []);

    const levelStore: LevelStore = useMemo(() => {
        return {
            levels,
            setLevel,
        };
    }, [levels, setLevel]);

    return (
        <LevelStoreContext.Provider value={levelStore}>
            {children}
        </LevelStoreContext.Provider>
    );
}
