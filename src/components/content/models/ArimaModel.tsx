import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import Layout from "../../layout/Layout.tsx";

import * as React from "react";
import ModelResultChartElement from "../../common/elements/charts/ModelResultChartElement.tsx";
import ModelResultElement from "../../common/elements/ModelResultElement.tsx";
import ArimaModelForm from "./ArimaModelForm.tsx";

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
                <ModelResultChartElement
                    responseBody={responseBody}
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
