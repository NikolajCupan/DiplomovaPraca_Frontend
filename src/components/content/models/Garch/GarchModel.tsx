import * as Type from "../../../../helpers/Types.tsx";
import "../../../../index.css";
import Layout from "../../../layout/Layout.tsx";
import ModelFullResult from "../Result/ModelFullResult.tsx";
import GarchModelForm from "./GarchModelForm.tsx";

import * as React from "react";

function GarchModel() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const content = (
        <>
            <div className="custom-container">
                <GarchModelForm
                    actionInProgress={actionInProgress}
                    setActionInProgress={setActionInProgress}
                    responseBody={responseBody}
                    setResponseBody={setResponseBody}
                />
            </div>

            <ModelFullResult
                responseBody={responseBody}
                actionInProgress={actionInProgress}
            />
        </>
    );

    return <Layout component={content} />;
}

export default GarchModel;
