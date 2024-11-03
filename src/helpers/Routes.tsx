import Data from "../components/content/Data";
import Home from "../components/content/Home";
import LinearRegression from "../components/content/LinearRegression";

export const ROUTES = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/data",
        element: <Data />,
    },
    {
        path: "/linear-regression",
        element: <LinearRegression />,
    },
];
