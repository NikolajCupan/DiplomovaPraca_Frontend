import { ROUTES } from "./Routes.tsx";

import * as ReactRouter from "react-router-dom";

export const router = ReactRouter.createBrowserRouter(
    ReactRouter.createRoutesFromElements(
        ROUTES.map((route) => (
            <ReactRouter.Route
                key={route.path}
                path={route.path}
                element={route.element}
            />
        )),
    ),
);
