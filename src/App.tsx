import { useState } from "react";

export function App() {
    const [clicks, setClicks] = useState(0);
    return (
        <button id="button"
            onClick={() => {
                setClicks(clicks + 1);
            }}
        >
            {clicks}
        </button>
    );
}
