import "./App.less";

import { useState } from "react";
import { LoadedLevel } from "./Level";
import { LevelSelect } from "./screens/level-select/LevelSelect";
import { PlayScreen } from "./screens/play/Play";
import { SwitchTransition } from "react-transition-group";
import { Slide } from "./components/transitions/Slide";

export function App() {
    const [level, setLevel] = useState<LoadedLevel | null>(null);

    const screen = level ? (
        <PlayScreen
            key="play"
            level={level}
            quit={(_winTime) => setLevel(null)}
            className="screen"
        />
    ) : (
        <LevelSelect
            key="level-select"
            setLevel={setLevel}
            className="screen"
        />
    );

    return (
        <SwitchTransition>
            <Slide key={screen.key!}>{screen}</Slide>
        </SwitchTransition>
    );
}
