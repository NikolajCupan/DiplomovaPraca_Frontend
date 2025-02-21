import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as VariousElements from "../../../helpers/VariousElements.tsx";
import "../../../index.css";
import ScrollableContainer from "../../common/elements/ScrollableContainer.tsx";
import LineChartWrapper from "../../common/elements/charts/LineChartWrapper.tsx";
import Layout from "../../layout/Layout.tsx";

import * as React from "react";

interface TransformationProps {
    Component: React.ComponentType<{
        selectedDatasetInfo: Type.DatasetInfo | null;
        setSelectedDatasetInfo: React.Dispatch<
            React.SetStateAction<Type.DatasetInfo | null>
        >;

        actionInProgress: boolean;
        setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

        responseBody: Type.RequestResult | null;
        setResponseBody: React.Dispatch<
            React.SetStateAction<Type.RequestResult | null>
        >;
    }>;
}

const Transformation: React.FC<TransformationProps> = ({ Component }) => {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [responseBodyTransformed, setResponseBodyTransformed] =
        React.useState<Type.RequestResult | null>(null);
    const [arrayTransformed, setArrayTransformed] =
        React.useState<Type.RequestResult | null>(null);
    const [arrayOriginal, setArrayOriginal] =
        React.useState<Type.RequestResult | null>(null);

    React.useEffect(() => {
        if (!responseBodyTransformed) {
            return;
        }

        loadTransformedData();
        loadOriginalData();
    }, [responseBodyTransformed]);

    const loadTransformedData = async () => {
        const datasetInfo: Type.DatasetInfo = responseBodyTransformed!.data;
        const datasetForViewing = await Helper.getDatasetForViewing(
            datasetInfo.idDataset,
        );

        const json: Type.RequestResult =
            Helper.transformDatasetForViewingToJson(datasetForViewing!);
        setArrayTransformed(json);
    };

    const loadOriginalData = async () => {
        if (!selectedDatasetInfo) {
            setArrayOriginal(null);
            return;
        }

        const datasetForViewing = await Helper.getDatasetForViewing(
            selectedDatasetInfo.idDataset,
        );

        const json: Type.RequestResult =
            Helper.transformDatasetForViewingToJson(datasetForViewing!);
        setArrayOriginal(json);
    };

    const getResultContent = () => {
        if (actionInProgress) {
            return VariousElements.actionInProgressElement;
        } else if (arrayTransformed && arrayOriginal) {
            return getChartsContent();
        } else {
            return (
                <div className="inner-container-style">
                    Zvoľte parametre a vykonajte analýzu
                </div>
            );
        }
    };

    const getChartsContent = () => {
        return (
            <>
                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                >
                    <LineChartWrapper
                        label={"Pôvodné dáta"}
                        yAxisArrayKey={"data"}
                        xAxisArrayKey={"date"}
                        responseBody={arrayOriginal!}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                        isXAxisDate={true}
                        frequency={responseBodyTransformed!.data.frequencyType}
                    />
                </ScrollableContainer>

                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                >
                    <LineChartWrapper
                        label={"Modifikované dáta"}
                        yAxisArrayKey={"data"}
                        xAxisArrayKey={"date"}
                        responseBody={arrayTransformed!}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                        isXAxisDate={true}
                        frequency={responseBodyTransformed!.data.frequencyType}
                    />
                </ScrollableContainer>
            </>
        );
    };

    const content = (
        <>
            <div className="custom-container">
                <Component
                    selectedDatasetInfo={selectedDatasetInfo}
                    setSelectedDatasetInfo={setSelectedDatasetInfo}
                    actionInProgress={actionInProgress}
                    setActionInProgress={setActionInProgress}
                    responseBody={responseBodyTransformed}
                    setResponseBody={setResponseBodyTransformed}
                />
            </div>

            <div className="custom-container" style={{ marginBottom: "20px" }}>
                {getResultContent()}
            </div>
        </>
    );

    return <Layout component={content} />;
};

export default Transformation;
