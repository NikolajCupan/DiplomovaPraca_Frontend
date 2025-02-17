import * as Constants from "../../../../helpers/Constants.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import * as VariousElements from "../../../../helpers/VariousElements.tsx";
import "../../../../index.css";
import Header from "../../../common/elements/Header.tsx";
import Layout from "../../../layout/Layout.tsx";
import ModelResult from "../ModelResult.tsx";
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
            setResponseBody(null);
            return noActionElement;
        }

        return (
            <>
                <div className="custom-container">
                    <Header
                        text={"Výsledok"}
                        breakpointWidth={300}
                        link={[]}
                        excludeInfoTooltip={true}
                    />

                    <RealPredictedChart
                        responseBody={responseBody}
                        jsonKey={Constants.FORECAST_KEY}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </div>

                <div
                    className="custom-container"
                    style={{ paddingBottom: "40px" }}
                >
                    <ModelResult responseBody={responseBody} />
                </div>

                <div className="custom-container">
                    <Header
                        text={"Testovacia množina"}
                        breakpointWidth={300}
                        link={[]}
                        excludeInfoTooltip={true}
                    />

                    <RealPredictedChart
                        responseBody={responseBody}
                        jsonKey={Constants.TRAIN_KEY}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />

                    <ResidualsChart
                        responseBody={responseBody}
                        jsonKey={Constants.TRAIN_KEY}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </div>

                <div
                    className="custom-container"
                    style={{ marginBottom: "20px" }}
                >
                    <Header
                        text={"Trénovacia množina"}
                        breakpointWidth={300}
                        link={[]}
                        excludeInfoTooltip={true}
                    />

                    <RealPredictedChart
                        responseBody={responseBody}
                        jsonKey={Constants.TEST_KEY}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />

                    <ResidualsChart
                        responseBody={responseBody}
                        jsonKey={Constants.TEST_KEY}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </div>
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
