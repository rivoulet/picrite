import "./App.less";

import { useState } from "react";
import { PlayScreen } from "./screens/play/Play";
import { LoadedLevel } from "./Level";
import { LevelSelect } from "./screens/level-select/LevelSelect";

export function App() {
    const [level, setLevel] = useState<LoadedLevel | null>(null);

    return level ? (
        <PlayScreen
            level={level}
            onWin={() => {
                console.log("Won!");
            }}
        />
    ) : (
        <LevelSelect setLevel={setLevel} />
    );
}
