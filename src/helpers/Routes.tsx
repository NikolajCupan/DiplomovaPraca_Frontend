import Data from "../components/content/data/Data.tsx";
import DatasetEditor from "../components/content/data/DatasetEditor.tsx";
import Home from "../components/content/Home.tsx";
import LinearRegression from "../components/content/LinearRegression.tsx";
import DickerFullerTest from "../components/content/tests/DickeyFullerTest.tsx";
import * as Constants from "../helpers/Constants.tsx";
import Test from "../testing/Test.tsx";
import Todo from "../testing/Todo.tsx";

export const ROUTES = [
    {
        path: Constants.HOME_LINK,
        element: <Home />,
    },
    {
        path: Constants.UPLOAD_DATASET_LINK,
        element: <Data />,
    },
    {
        path: Constants.EDIT_DATASET_LINK,
        element: <DatasetEditor />,
    },
    {
        path: Constants.LINEAR_REGRESSION_LINK,
        element: <LinearRegression />,
    },
    {
        path: Constants.DICKER_FULLER_TEST_LINK,
        element: <DickerFullerTest />,
    },
    {
        path: Constants.TESTING_LINK,
        element: <Test />,
    },
    {
        path: Constants.TODO_LINK,
        element: <Todo />,
    },
];
