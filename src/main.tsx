import { STRICT_MODE } from "./helpers/Constants.tsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement: HTMLElement | null = document.getElementById("root");

if (rootElement) {
    if (STRICT_MODE) {
        createRoot(rootElement).render(
            <StrictMode>
                <App />
            </StrictMode>,
        );
    } else {
        createRoot(rootElement).render(<App />);
    }
} else {
    console.error("Root element was not found");
}
