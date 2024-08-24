import { Dispatch, SetStateAction } from "react";

import { AppState } from "src/AppState";

export interface CardProps {
    setState: Dispatch<SetStateAction<AppState>>;
    className?: string | undefined;
}
