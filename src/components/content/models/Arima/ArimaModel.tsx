import * as Constants from "../../../../helpers/Constants.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import "../../../../index.css";
import ModelResultElement from "../../../common/elements/ModelResultElement.tsx";
import Layout from "../../../layout/Layout.tsx";
import RealPredictedChart from "../RealPredictedChart.tsx";
import ResidualsChart from "../ResidualsChart.tsx";
import ArimaModelForm from "./ArimaModelForm.tsx";

import * as React from "react";

function ArimaModel() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

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

            <div className="custom-container">
                <RealPredictedChart
                    responseBody={responseBody}
                    jsonKey={Constants.TRAIN_KEY}
                    height={Constants.DEFAULT_CHART_HEIGHT}
                />
            </div>

            <div className="custom-container">
                <ResidualsChart
                    responseBody={responseBody}
                    jsonKey={Constants.TRAIN_KEY}
                    height={Constants.DEFAULT_CHART_HEIGHT}
                />
            </div>

            <div className="custom-container">
                <ModelResultElement responseBody={responseBody} />
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default ArimaModel;
