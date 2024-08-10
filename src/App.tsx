import "./App.less";

import { useState } from "react";
import { ScrollableGrid } from "./components/Grid";
import { CellMark } from "./CellMark";

export function App() {
    const [marks, setMarks] = useState(() => {
        const marks = new Array<CellMark>(100);
        for (let i = 0; i < 100; i++) {
            const x = Math.random();
            marks[i] = [CellMark.Empty, CellMark.Mark, CellMark.Cross][
                Math.floor(x * 3)
            ];
        }
        return marks;
    });

    return (
        <ScrollableGrid
            width={10}
            height={10}
            marks={marks}
            className="main-grid"
        />
    );
}
