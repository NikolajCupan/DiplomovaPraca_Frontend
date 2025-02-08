import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import Layout from "../../layout/Layout.tsx";
import CorrelogramForm from "./CorrelogramForm.tsx";

import * as React from "react";

function Correlogram() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] = React.useState<
        [Type.RequestResult, Type.RequestResult] | null
    >(null);

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

            <div
                className="custom-container"
                style={{ marginBottom: "20px" }}
            ></div>
        </>
    );

    return <Layout component={content} />;
}

export default Correlogram;
