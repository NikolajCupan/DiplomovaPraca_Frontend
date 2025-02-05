import * as Type from "../../../helpers/Types.tsx";
import Layout from "../../layout/Layout.tsx";

import * as React from "react";
import PeriodogramForm from "./PeriodogramForm.tsx";

function Periodogram() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const content = (
        <>
            <div className="custom-container">
                <PeriodogramForm
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

export default Periodogram;
