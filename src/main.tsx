import App from "./App.tsx";
import * as Constants from "./helpers/Constants.tsx";
import "./index.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import * as React from "react";
import { createRoot } from "react-dom/client";

const rootElement: HTMLElement | null = document.getElementById("root");

if (rootElement) {
    if (Constants.STRICT_MODE) {
        createRoot(rootElement).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
        );
    } else {
        createRoot(rootElement).render(<App />);
    }
} else {
    console.error("Root element was not found");
}
