import * as Constants from "../../../helpers/Constants.tsx";
import * as HelperElements from "../../../helpers/HelperElements.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import Layout from "../../layout/Layout.tsx";
import DifferenceForm from "./DifferenceForm.tsx";

import * as React from "react";

function Difference() {
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
                {/* <ScrollableContainer
                    breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                >
                    <LineChartWrapper
                        label={"Pôvodné dáta"}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                        responseBody={responseBody[0]}
                        xAxisArrayKey={"frequency"}
                        yAxisArrayKey={"power"}
                    />
                </ScrollableContainer>

                <ScrollableContainer
                    breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
                >
                    <LineChartWrapper
                        label={"Transformované dáta"}
                        xAxisArrayKey={"frequency"}
                        yAxisArrayKey={"power"}
                        responseBody={responseBody!}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </ScrollableContainer> */}
            </>
        );
    };

    const content = (
        <>
            <div className="custom-container">
                <DifferenceForm
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

export default Difference;
