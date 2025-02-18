import * as Type from "../../../../helpers/Types.tsx";
import Layout from "../../../layout/Layout.tsx";
import HoltWinterModelForm from "./HoltWinterModelForm.tsx";

import * as React from "react";

function HoltWinterModel() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const content = (
        <>
            <div className="custom-container">
                <HoltWinterModelForm
                    actionInProgress={actionInProgress}
                    setActionInProgress={setActionInProgress}
                    responseBody={responseBody}
                    setResponseBody={setResponseBody}
                />
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default HoltWinterModel;
