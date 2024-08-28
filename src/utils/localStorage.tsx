import {
    Context,
    Dispatch,
    FunctionComponent,
    ReactNode,
    SetStateAction,
    createContext,
} from "react";
import { useEffect, useState } from "react";

export interface LocalStoreContextProviderProps {
    children?: ReactNode | undefined;
}

export function createLocalStore<T, U>(
    name: string,
    defaultValue: T,
    f: (value: T, setValue: Dispatch<SetStateAction<T>>) => U,
): [Context<U | null>, FunctionComponent<LocalStoreContextProviderProps>] {
    const Context = createContext<U | null>(null);

    return [
        Context,
        ({ children }: LocalStoreContextProviderProps) => {
            const [value, setValue] = useState(() => {
                const value = localStorage.getItem(name);
                if (value === null) {
                    return defaultValue;
                } else {
                    return JSON.parse(value) as T;
                }
            });

            useEffect(() => {
                localStorage.setItem(name, JSON.stringify(value));
            }, [value]);

            const store = f(value, setValue);

            return (
                <Context.Provider value={store}>{children}</Context.Provider>
            );
        },
    ];
}
