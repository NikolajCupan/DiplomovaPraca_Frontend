import Data from "../components/content/data/Data.tsx";
import DatasetViewer from "../components/content/data/DatasetViewer.tsx";
import Home from "../components/content/Home.tsx";
import ArimaModel from "../components/content/models/Arima/ArimaModel.tsx";
import DoubleExpSmoothing from "../components/content/models/DoubleExpSmoothing/DoubleExpSmoothing.tsx";
import HoltWinterModel from "../components/content/models/HoltWinter/HoltWinterModel.tsx";
import SimpleExpSmoothing from "../components/content/models/SimpleExpSmoothing/SimpleExpSmoothing.tsx";
import ArchTest from "../components/content/tests/ArchTest.tsx";
import Correlogram from "../components/content/tests/Correlogram.tsx";
import DickerFullerTest from "../components/content/tests/DickeyFullerTest.tsx";
import KPSSTest from "../components/content/tests/KPSSTest.tsx";
import LjungBoxTest from "../components/content/tests/LjungBoxTest.tsx";
import Periodogram from "../components/content/tests/Periodogram.tsx";
import SeasonalDecompose from "../components/content/tests/SeasonalDecompose.tsx";
import Difference from "../components/content/transformations/Difference.tsx";
import Logarithm from "../components/content/transformations/Logarithm.tsx";
import Normalization from "../components/content/transformations/Normalization.tsx";
import Standardization from "../components/content/transformations/Standardization.tsx";
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
        path: Constants.VIEW_DATASET_LINK,
        element: <DatasetViewer />,
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
        path: Constants.CORRELOGRAM_LINK,
        element: <Correlogram />,
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
        path: Constants.DIFFERENCE_LINK,
        element: <Difference />,
    },
    {
        path: Constants.LOGARITHM_LINK,
        element: <Logarithm />,
    },
    {
        path: Constants.NORMALIZATION_LINK,
        element: <Normalization />,
    },
    {
        path: Constants.STANDARDIZATION_LINK,
        element: <Standardization />,
    },
    {
        path: Constants.ARIMA_LINK,
        element: <ArimaModel />,
    },
    {
        path: Constants.SIMPLE_EXP_SMOOTHING_LINK,
        element: <SimpleExpSmoothing />,
    },
    {
        path: Constants.DOUBLE_EXP_SMOOTHING_LINK,
        element: <DoubleExpSmoothing />,
    },
    {
        path: Constants.HOLT_WINTER,
        element: <HoltWinterModel />,
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
