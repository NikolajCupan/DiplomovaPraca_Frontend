import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import Layout from "../../layout/Layout.tsx";

import * as React from "react";
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

            <div className="custom-container">TODO</div>
        </>
    );

    return <Layout component={content} />;
}

export default ArimaModel;
