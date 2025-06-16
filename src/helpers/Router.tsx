import * as React from "react";
import * as ReactRouter from "react-router-dom";
import { ROUTES } from "./Routes.tsx";

const ErrorRedirect = () => {
    React.useEffect(() => {
        window.location.href = "/";
    }, []);

    return null;
};

export const router = ReactRouter.createBrowserRouter(
    ReactRouter.createRoutesFromElements(
        ROUTES.map((route) => (
            <ReactRouter.Route
                key={route.path}
                path={route.path}
                element={route.element}
                errorElement={<ErrorRedirect />}
            />
        )),
    ),
);
