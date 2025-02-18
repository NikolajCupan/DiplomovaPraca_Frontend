import * as Constants from "../../../../helpers/Constants.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import * as VariousElements from "../../../../helpers/VariousElements.tsx";
import "../../../../index.css";
import Header from "../../../common/elements/Header.tsx";
import ResultElement from "../../../common/elements/ResultElement.tsx";
import ScrollableContainer from "../../../common/elements/ScrollableContainer.tsx";
import Layout from "../../../layout/Layout.tsx";
import AccuracyTable from "../AccuracyTable.tsx";
import ModelResult from "../ModelResult.tsx";
import ModelResultTable from "../ModelResultTable.tsx";
import RealPredictedChart from "../RealPredictedChart.tsx";
import ResidualsChart from "../ResidualsChart.tsx";
import ArimaModelForm from "./ArimaModelForm.tsx";

import * as React from "react";

function ArimaModel() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const noActionElement = (
        <div className="custom-container" style={{ marginBottom: "20px" }}>
            <div className="inner-container-style">Vykonajte akciu</div>
        </div>
    );

    const getResultContent = () => {
        if (actionInProgress) {
            return (
                <div
                    className="custom-container"
                    style={{ marginBottom: "20px" }}
                >
                    <div className="inner-container-style">
                        {VariousElements.actionInProgressElement}
                    </div>
                </div>
            );
        } else if (!responseBody) {
            return noActionElement;
        }

        const responseBodyData: Record<string, any> = JSON.parse(
            responseBody.data,
        );

        const success = responseBodyData[Constants.SUCCESS_KEY];
        if (!success) {
            return (
                <div
                    className="custom-container"
                    style={{ marginBottom: "20px" }}
                >
                    <ResultElement
                        actionInProgress={actionInProgress}
                        responseBody={responseBody}
                    />
                </div>
            );
        }

        return (
            <>
                <div className="custom-container">
                    <Header
                        text={"Prehľad"}
                        breakpointWidth={300}
                        link={[]}
                        excludeInfoTooltip={true}
                    />

                    <AccuracyTable
                        responseBody={responseBody}
                        trainJsonKey={"train_accuracy"}
                        testJsonKey={"test_accuracy"}
                        customStyle={{ marginBottom: "40px" }}
                    />

                    <ModelResultTable responseBody={responseBody} />

                    <ScrollableContainer
                        breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                    >
                        <RealPredictedChart
                            responseBody={responseBody}
                            jsonKey={Constants.FORECAST_KEY}
                            height={Constants.DEFAULT_CHART_HEIGHT}
                        />
                    </ScrollableContainer>
                </div>

                <div
                    className="custom-container"
                    style={{ paddingBottom: "40px" }}
                >
                    <ModelResult responseBody={responseBody} />
                </div>

                <div className="custom-container">
                    <Header
                        text={"Trénovacia množina"}
                        breakpointWidth={300}
                        link={[]}
                        excludeInfoTooltip={true}
                    />

                    <ScrollableContainer
                        breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                    >
                        <RealPredictedChart
                            responseBody={responseBody}
                            jsonKey={Constants.TRAIN_KEY}
                            height={Constants.DEFAULT_CHART_HEIGHT}
                        />
                    </ScrollableContainer>

                    <ScrollableContainer
                        breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                    >
                        <ResidualsChart
                            responseBody={responseBody}
                            jsonKey={Constants.TRAIN_KEY}
                            height={Constants.DEFAULT_CHART_HEIGHT}
                        />
                    </ScrollableContainer>
                </div>

                {Constants.TEST_KEY in responseBodyData && (
                    <div className="custom-container">
                        <Header
                            text={"Testovacia množina"}
                            breakpointWidth={300}
                            link={[]}
                            excludeInfoTooltip={true}
                        />

                        <ScrollableContainer
                            breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                        >
                            <RealPredictedChart
                                responseBody={responseBody}
                                jsonKey={Constants.TEST_KEY}
                                height={Constants.DEFAULT_CHART_HEIGHT}
                            />
                        </ScrollableContainer>

                        <ScrollableContainer
                            breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                        >
                            <ResidualsChart
                                responseBody={responseBody}
                                jsonKey={Constants.TEST_KEY}
                                height={Constants.DEFAULT_CHART_HEIGHT}
                            />
                        </ScrollableContainer>
                    </div>
                )}

                <div className="custom-container">
                    <Header
                        text={"Testy"}
                        breakpointWidth={300}
                        link={[]}
                        excludeInfoTooltip={true}
                    />

                    <p className="sub-header" style={{ marginBottom: "25px" }}>
                        Všetky testy sú vykonané na reziduách z trénovacej
                        množiny
                    </p>

                    <Header
                        text={"Ljung-Box test"}
                        breakpointWidth={400}
                        link={
                            "https://www.statsmodels.org/dev/generated/statsmodels.stats.diagnostic.acorr_ljungbox.html"
                        }
                        fontSizePx={25}
                        excludeInfoTooltip={true}
                    />

                    <ResultElement
                        actionInProgress={actionInProgress}
                        responseBody={{
                            message: "",
                            data: JSON.stringify(
                                responseBodyData["ljung_box_test"],
                            ),
                        }}
                    />

                    <Header
                        text={"ARCH test"}
                        breakpointWidth={300}
                        link={
                            "https://www.statsmodels.org/dev/generated/statsmodels.stats.diagnostic.het_arch.html"
                        }
                        fontSizePx={25}
                        excludeInfoTooltip={true}
                    />

                    <ResultElement
                        actionInProgress={actionInProgress}
                        responseBody={{
                            message: "",
                            data: JSON.stringify(responseBodyData["arch_test"]),
                        }}
                    />
                </div>

                <div style={{ marginBottom: "20px" }}></div>
            </>
        );
    };

    const content = (
        <>
            <div className="custom-container">
                <ArimaModelForm
                    actionInProgress={actionInProgress}
                    setActionInProgress={setActionInProgress}
                    responseBody={responseBody}
                    setResponseBody={setResponseBody}
                />
            </div>

            {getResultContent()}
        </>
    );

    return <Layout component={content} />;
}

export default ArimaModel;
