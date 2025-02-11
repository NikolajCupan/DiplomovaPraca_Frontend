import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import ResultElement from "../../common/elements/ResultElement.tsx";
import Layout from "../../layout/Layout.tsx";
import KPSSTestForm from "./KPSSTestForm.tsx";

import * as React from "react";

function KPSSTest() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const content = (
        <>
            <div className="custom-container">
                <KPSSTestForm
                    actionInProgress={actionInProgress}
                    setActionInProgress={setActionInProgress}
                    responseBody={responseBody}
                    setResponseBody={setResponseBody}
                />
            </div>

            <div className="custom-container">
                <ResultElement
                    actionInProgress={actionInProgress}
                    responseBody={responseBody}
                />
            </div>
        </>
    );
    return <Layout component={content} />;
}

export default KPSSTest;
