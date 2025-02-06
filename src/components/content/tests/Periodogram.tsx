import * as Constants from "../../../helpers/Constants.tsx";
import * as HelperElements from "../../../helpers/HelperElements.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import LineChartWrapper from "../../common/elements/LineChartWrapper.tsx";
import ScrollableContainer from "../../common/elements/ScrollableContainer.tsx";
import Layout from "../../layout/Layout.tsx";
import PeriodogramForm from "./PeriodogramForm.tsx";

import * as React from "react";

function Periodogram() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const getResultContent = () => {
        if (actionInProgress) {
            return HelperElements.actionInProgressElement;
        } else if (responseBody) {
            const json: Record<string, any> = JSON.parse(responseBody.data);
            if (!json[Constants.SUCCESS_KEY]) {
                return (
                    <div className="inner-container-style">
                        Analýzu nebolo možné vykonať
                    </div>
                );
            }

            return chartsContent;
        } else {
            return (
                <div className="inner-container-style">
                    Zvoľte parametre a vykonajte analýzu
                </div>
            );
        }
    };

    const chartsContent = (
        <>
            <ScrollableContainer
                breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
            >
                <LineChartWrapper
                    label={"Frekvencia"}
                    xAxisArrayKey={"frequency"}
                    yAxisArrayKey={"power"}
                    responseBody={responseBody}
                    height={Constants.DEFAULT_LINE_CHART_HEIGHT}
                />
            </ScrollableContainer>

            <ScrollableContainer
                breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
            >
                <LineChartWrapper
                    label={"Perióda"}
                    xAxisArrayKey={"period"}
                    yAxisArrayKey={"reversed_power"}
                    color={"green"}
                    responseBody={responseBody}
                    height={Constants.DEFAULT_LINE_CHART_HEIGHT}
                />
            </ScrollableContainer>
        </>
    );

    const content = (
        <>
            <div className="custom-container">
                <PeriodogramForm
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

export default Periodogram;
