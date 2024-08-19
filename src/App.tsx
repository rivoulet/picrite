import "./App.less";

import { useState } from "react";
import { PlayScreen } from "./screens/play/Play";
import { generateLevel } from "./algorithms/generate";

export function App() {
    const [level, setLevel] = useState(() => generateLevel(10, 10));

    return (
        <PlayScreen
            level={level}
            onWin={() => {
                console.log("Won!");
            }}
        />
    );
}
