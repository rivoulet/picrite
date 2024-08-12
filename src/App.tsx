import "./App.less";

import { useEffect, useState } from "react";
import { CellMark } from "./CellMark";
import { loadLevel } from "./algorithms/load";
import { PlayGrid } from "./components/play-grid/PlayGrid";

export function App() {
    const width = 10, height = 10;

    const [marks, setMarks] = useState(() => {
        const marks = new Array<CellMark>(width * height);
        for (let i = 0; i < width * height; i++) {
            marks[i] = [CellMark.Empty, CellMark.Mark, CellMark.Cross][
                Math.floor(Math.random() * 3)
            ];
        }
        return marks;
    });
    const [level, setLevel] = useState(() =>
        loadLevel({
            width,
            height,
            cells: marks.map((mark) => mark === CellMark.Mark),
        })
    );

    // Test animations
    // useEffect(() => {
    //     const id = setInterval(() => {
    //         const marks = new Array<CellMark>(width * height);
    //         for (let i = 0; i < width * height; i++) {
    //             marks[i] = [CellMark.Empty, CellMark.Mark, CellMark.Cross][
    //                 Math.floor(Math.random() * 3)
    //             ];
    //         }
    //         setMarks(marks);
    //         setLevel(loadLevel({
    //             width,
    //             height,
    //             cells: marks.map((mark) => mark === CellMark.Mark),
    //         }));
    //     }, 2000);
    //     return () => clearInterval(id);
    // }, []);

    return <PlayGrid level={level} marks={marks} className="main-grid" />;
}
