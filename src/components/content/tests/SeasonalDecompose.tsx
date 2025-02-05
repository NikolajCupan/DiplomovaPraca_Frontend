import * as Constants from "../../../helpers/Constants.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import LineChartWrapper from "../../common/elements/LineChartWrapper.tsx";
import ScrollableContainer from "../../common/elements/ScrollableContainer.tsx";
import Layout from "../../layout/Layout.tsx";
import SeasonalDecomposeForm from "./SeasonalDecomposeForm.tsx";
import "./TestStyles.css";

import * as HelperElements from "../../../helpers/HelperElements.tsx";

import * as React from "react";

const lineChartHeight = 400;
const breakpointWidth = 600;

function SeasonalDecompose() {
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
                breakpointWidth={breakpointWidth}
                customStyle={{ marginBottom: "20px" }}
            >
                <LineChartWrapper
                    label={"pozorované hodnoty"}
                    arrayKey={"observed"}
                    responseBody={responseBody}
                    height={lineChartHeight}
                />
            </ScrollableContainer>

            <ScrollableContainer
                breakpointWidth={breakpointWidth}
                customStyle={{ marginBottom: "20px" }}
            >
                <LineChartWrapper
                    label={"trend"}
                    arrayKey={"trend"}
                    responseBody={responseBody}
                    height={lineChartHeight}
                />
            </ScrollableContainer>

            <ScrollableContainer
                breakpointWidth={breakpointWidth}
                customStyle={{ marginBottom: "20px" }}
            >
                <LineChartWrapper
                    label={"sezónna zložka"}
                    arrayKey={"seasonal"}
                    responseBody={responseBody}
                    height={lineChartHeight}
                />
            </ScrollableContainer>

            <ScrollableContainer breakpointWidth={breakpointWidth}>
                <LineChartWrapper
                    label={"reziduá"}
                    arrayKey={"resid"}
                    responseBody={responseBody}
                    height={lineChartHeight}
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
