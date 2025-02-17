import * as Constants from "../../../helpers/Constants.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as VariousElements from "../../../helpers/VariousElements.tsx";
import "../../../index.css";
import LineChartWrapper from "../../common/elements/charts/LineChartWrapper.tsx";
import ScrollableContainer from "../../common/elements/ScrollableContainer.tsx";
import Layout from "../../layout/Layout.tsx";
import SeasonalDecomposeForm from "./SeasonalDecomposeForm.tsx";

import * as React from "react";

function SeasonalDecompose() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const getResultContent = () => {
        if (actionInProgress) {
            return VariousElements.actionInProgressElement;
        } else if (responseBody) {
            const json: Record<string, any> = JSON.parse(responseBody.data);
            if (!json[Constants.SUCCESS_KEY]) {
                return (
                    <div className="inner-container-style">
                        Dekompozíciu nebolo možné vykonať
                    </div>
                );
            }

            return chartsContent;
        } else {
            return (
                <div className="inner-container-style">
                    Zvoľte parametre a vykonajte dekompozíciu
                </div>
            );
        }
    };

    const chartsContent = (
        <>
            <ScrollableContainer
                breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                customStyle={{ marginBottom: "20px" }}
            >
                <LineChartWrapper
                    label={"pozorované hodnoty"}
                    yAxisArrayKey={"observed"}
                    responseBody={responseBody!}
                    height={Constants.DEFAULT_CHART_HEIGHT}
                />
            </ScrollableContainer>

            <ScrollableContainer
                breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                customStyle={{ marginBottom: "20px" }}
            >
                <LineChartWrapper
                    label={"trend"}
                    yAxisArrayKey={"trend"}
                    responseBody={responseBody!}
                    height={Constants.DEFAULT_CHART_HEIGHT}
                />
            </ScrollableContainer>

            <ScrollableContainer
                breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                customStyle={{ marginBottom: "20px" }}
            >
                <LineChartWrapper
                    label={"sezónna zložka"}
                    yAxisArrayKey={"seasonal"}
                    responseBody={responseBody!}
                    height={Constants.DEFAULT_CHART_HEIGHT}
                />
            </ScrollableContainer>

            <ScrollableContainer
                breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
            >
                <LineChartWrapper
                    label={"reziduá"}
                    yAxisArrayKey={"resid"}
                    responseBody={responseBody!}
                    height={Constants.DEFAULT_CHART_HEIGHT}
                />
            </ScrollableContainer>
        </>
    );

    const content = (
        <>
            <div className="custom-container">
                <SeasonalDecomposeForm
                    actionInProgress={actionInProgress}
                    setActionInProgress={setActionInProgress}
                    responseBody={responseBody}
                    setResponseBody={setResponseBody}
                />
            </div>

            <div className="custom-container" style={{ marginBottom: "20px" }}>
                {getResultContent()}
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default SeasonalDecompose;
