import "./App.less";

import { useEffect, useState } from "react";
import { CellMark } from "./CellMark";
import { PlayGrid } from "./components/play-grid/PlayGrid";

export function App() {
    const [marks, setMarks] = useState(() => {
        const marks = new Array<CellMark>(100);
        for (let i = 0; i < 100; i++) {
            marks[i] = [CellMark.Empty, CellMark.Mark, CellMark.Cross][
                Math.floor(Math.random() * 3)
            ];
        }
        return marks;
    });

    const [selection, setSelection] = useState<[number, number] | null>(null);

    // Test animations
    useEffect(() => {
        const id = setInterval(() => {
            const marks = new Array<CellMark>(100);
            for (let i = 0; i < 100; i++) {
                marks[i] = [CellMark.Empty, CellMark.Mark, CellMark.Cross][
                    Math.floor(Math.random() * 3)
                ];
            }
            setMarks(marks);
        }, 2000);
        return () => clearInterval(id);
    }, []);

    return (
        <PlayGrid
            width={10}
            height={10}
            marks={marks}
            selection={selection}
            setSelection={setSelection}
            autoFocus={true}
            className="main-grid"
        />
    );
}
