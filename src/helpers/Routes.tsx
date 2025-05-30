import Data from "../components/content/data/Data.tsx";
import DatasetViewer from "../components/content/data/DatasetViewer.tsx";
import ArimaModel from "../components/content/models/arima/ArimaModel.tsx";
import DoubleExpSmoothingModel from "../components/content/models/doubleExpSmoothing/DoubleExpSmoothingModel.tsx";
import HoltWinterModel from "../components/content/models/holtWinter/HoltWinterModel.tsx";
import NeuralNetworkModel from "../components/content/models/neuralNetwork/NeuralNetworkModel.tsx";
import SimpleExpSmoothingModel from "../components/content/models/simpleExpSmoothing/SimpleExpSmoothingModel.tsx";
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

import * as ReactRouter from "react-router-dom";

export const ROUTES = [
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
        element: <SimpleExpSmoothingModel />,
    },
    {
        path: Constants.DOUBLE_EXP_SMOOTHING_LINK,
        element: <DoubleExpSmoothingModel />,
    },
    {
        path: Constants.HOLT_WINTER_LINK,
        element: <HoltWinterModel />,
    },
    {
        path: Constants.NEURAL_NETWORK_LINK,
        element: <NeuralNetworkModel />,
    },
    {
        path: "*",
        element: (
            <ReactRouter.Navigate to={Constants.UPLOAD_DATASET_LINK} replace />
        ),
    },
];
