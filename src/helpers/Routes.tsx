import Data from "../components/content/data/Data.tsx";
import DatasetEditor from "../components/content/data/DatasetEditor.tsx";
import Home from "../components/content/Home.tsx";
import LinearRegression from "../components/content/LinearRegression.tsx";
import ArchTest from "../components/content/tests/ArchTest.tsx";
import DickerFullerTest from "../components/content/tests/DickeyFullerTest.tsx";
import KPSSTest from "../components/content/tests/KPSSTest.tsx";
import LjungBoxTest from "../components/content/tests/LjungBoxTest.tsx";
import Periodogram from "../components/content/tests/Periodogram.tsx";
import SeasonalDecompose from "../components/content/tests/SeasonalDecompose.tsx";
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
        path: Constants.DICKEY_FULLER_TEST_LINK,
        element: <DickerFullerTest />,
    },
    {
        path: Constants.KPSS_TEST_LINK,
        element: <KPSSTest />,
    },
    {
        path: Constants.SEASONAL_DECOMPOSE_LINK,
        element: <SeasonalDecompose />,
    },
    {
        path: Constants.PERIODOGRAM_LINK,
        element: <Periodogram />,
    },
    {
        path: Constants.ARCH_TEST_LINK,
        element: <ArchTest />,
    },
    {
        path: Constants.LJUNG_BOX_TEST_LINK,
        element: <LjungBoxTest />,
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
