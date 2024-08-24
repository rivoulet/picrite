import "./main.less";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "src/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
    import.meta.env.DEV ? (
        <StrictMode>
            <App />
        </StrictMode>
    ) : (
        <App />
    ),
);
