import * as Constants from "../../../helpers/Constants.tsx";
import * as HelperElements from "../../../helpers/HelperElements.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import BarChartWrapper from "../../common/elements/charts/BarChartWrapper.tsx";
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
            return HelperElements.actionInProgressElement;
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
            <ScrollableContainer
                breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
            >
                <BarChartWrapper
                    label={"graf"}
                    height={Constants.DEFAULT_CHART_HEIGHT}
                    responseBody={responseBody[0]}
                    yAxisArrayKey={"acf_values"}
                />
            </ScrollableContainer>
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
