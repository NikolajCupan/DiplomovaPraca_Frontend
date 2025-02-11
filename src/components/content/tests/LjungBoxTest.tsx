import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import ResultElement from "../../common/elements/ResultElement.tsx";
import Layout from "../../layout/Layout.tsx";
import LjungBoxTestFrom from "./LjungBoxTestForm.tsx";

import * as React from "react";

function LjungBoxTest() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const content = (
        <>
            <div className="custom-container">
                <LjungBoxTestFrom
                    actionInProgress={actionInProgress}
                    setActionInProgress={setActionInProgress}
                    responseBody={responseBody}
                    setResponseBody={setResponseBody}
                />
            </div>

            <div className="custom-container" style={{ marginBottom: "20px" }}>
                <ResultElement
                    actionInProgress={actionInProgress}
                    responseBody={responseBody}
                />
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default LjungBoxTest;
