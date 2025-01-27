import Data from "../components/content/data/Data.tsx";
import DatasetEditor from "../components/content/data/DatasetEditor.tsx";
import Home from "../components/content/Home.tsx";
import LinearRegression from "../components/content/LinearRegression.tsx";

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
        path: "/data/edit",
        element: <DatasetEditor />,
    },
    {
        path: "/linear-regression",
        element: <LinearRegression />,
    },
];
