import * as Constants from "../../../helpers/Constants.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as VariousElements from "../../../helpers/VariousElements.tsx";
import "../../../index.css";
import ConfidenceIntervalChartWrapper from "../../common/elements/charts/ConfidenceIntervalChartWrapper.tsx";
import ScrollableContainer from "../../common/elements/ScrollableContainer.tsx";
import Layout from "../../layout/Layout.tsx";
import CorrelogramForm from "./CorrelogramForm.tsx";

import * as React from "react";

function Correlogram() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] = React.useState<
        [Type.RequestResult, Type.RequestResult] | null
    >(null);

    const getResultContent = () => {
        if (actionInProgress) {
            return VariousElements.actionInProgressElement;
        } else if (responseBody) {
            const acfJson: Record<string, any> = JSON.parse(
                responseBody[0].data,
            );
            const pacfJson: Record<string, any> = JSON.parse(
                responseBody[1].data,
            );

            if (
                !acfJson[Constants.SUCCESS_KEY] ||
                !pacfJson[Constants.SUCCESS_KEY]
            ) {
                return (
                    <div className="inner-container-style">
                        Analýzu nebolo možné vykonať
                    </div>
                );
            }

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
        if (!responseBody) {
            return;
        }

        return (
            <>
                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                >
                    <ConfidenceIntervalChartWrapper
                        label={"ACF"}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                        responseBody={responseBody[0]}
                        yAxisArrayKey={"acf_values"}
                        confidenceIntervalUpperBoundKey={
                            Constants.CONFIDENCE_INTERVAL_UPPER_BOUND_KEY
                        }
                        confidenceIntervalLowerBoundKey={
                            Constants.CONFIDENCE_INTERVAL_LOWER_BOUND_KEY
                        }
                    />
                </ScrollableContainer>

                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                >
                    <ConfidenceIntervalChartWrapper
                        label={"PACF"}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                        responseBody={responseBody[1]}
                        yAxisArrayKey={"pacf_values"}
                        confidenceIntervalUpperBoundKey={
                            Constants.CONFIDENCE_INTERVAL_UPPER_BOUND_KEY
                        }
                        confidenceIntervalLowerBoundKey={
                            Constants.CONFIDENCE_INTERVAL_LOWER_BOUND_KEY
                        }
                    />
                </ScrollableContainer>
            </>
        );
    };

    const content = (
        <>
            <div className="custom-container">
                <CorrelogramForm
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

export default Correlogram;
