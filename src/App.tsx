import "./App.less";

import { useState } from "react";
import { loadLevel } from "./algorithms/load";
import { PlayScreen } from "./screens/play/Play";

export function App() {
    const [level, setLevel] = useState(() => {
        const width = 10;
        const height = 10;
        const cells = new Array<boolean>(width * height);
        for (let i = 0; i < width * height; i++) {
            cells[i] = Math.random() >= 0.5;
        }
        return loadLevel({
            width,
            height,
            cells,
        });
    });

    return <PlayScreen level={level} />;
}
