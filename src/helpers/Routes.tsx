import Data from "../components/content/data/Data";
import DatasetEditor from "../components/content/data/DatasetEditor";
import Home from "../components/content/Home";
import LinearRegression from "../components/content/LinearRegression";
import Test from "../testing/Test";

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
        path: "/data/edit/:idDataset",
        element: <DatasetEditor />,
    },
    {
        path: "/linear-regression",
        element: <LinearRegression />,
    },
    {
        path: "/test",
        element: <Test />,
    },
];
