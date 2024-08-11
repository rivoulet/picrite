import "./App.less";

import { useEffect, useState } from "react";
import { SelectableGrid } from "./components/grid/Grid";
import { CellMark } from "./CellMark";

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

    const [selection, setSelection] = useState<[number, number] | null>([0, 0]);

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

            setSelection(
                Math.random() > 0.2
                    ? [
                          Math.min(
                              Math.max(
                                  (selection
                                      ? selection[0]
                                      : Math.floor(Math.random() * 10)) +
                                      [0, 1, -1][Math.floor(Math.random() * 3)],
                                  0
                              ),
                              9
                          ),
                          Math.min(
                              Math.max(
                                  (selection
                                      ? selection[1]
                                      : Math.floor(Math.random() * 10)) +
                                      [0, 1, -1][Math.floor(Math.random() * 3)],
                                  0
                              ),
                              9
                          ),
                      ]
                    : null
            );
        }, 1000);
        return () => clearInterval(id);
    });

    return (
        <SelectableGrid
            width={10}
            height={10}
            marks={marks}
            selection={selection}
            className="main-grid"
        />
    );
}
