import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as HelperElements from "../../../helpers/HelperElements.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import ScrollableContainer from "../../common/elements/ScrollableContainer.tsx";
import LineChartWrapper from "../../common/elements/charts/LineChartWrapper.tsx";
import Layout from "../../layout/Layout.tsx";
import DifferenceForm from "./DifferenceForm.tsx";

import * as React from "react";

function Difference() {
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

        const json: Type.RequestResult = Helper.transformToJson(
            datasetForViewing!,
        );
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

        const json: Type.RequestResult = Helper.transformToJson(
            datasetForViewing!,
        );
        setArrayOriginal(json);
    };

    const getResultContent = () => {
        if (actionInProgress) {
            return HelperElements.actionInProgressElement;
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
                    breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
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
                    breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
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
                <DifferenceForm
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
}

export default Difference;
