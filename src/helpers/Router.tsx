import { ROUTES } from "./Routes.tsx";

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

export const router = createBrowserRouter(
    createRoutesFromElements(
        ROUTES.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
        )),
    ),
);
