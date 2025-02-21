import * as Type from "../../../../helpers/Types.tsx";
import "../../../../index.css";
import Header from "../../../common/elements/Header.tsx";
import ResultElement from "../../../common/elements/ResultElement.tsx";
import Layout from "../../../layout/Layout.tsx";
import ModelFullResult from "../Result/ModelFullResult.tsx";
import ArimaModelForm from "./ArimaModelForm.tsx";

import * as React from "react";

function ArimaModel() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const getTestsContent = () => {
        if (!responseBody) {
            return <></>;
        }

        const responseBodyData: Record<string, any> = JSON.parse(
            responseBody.data,
        );

        return (
            <div className="custom-container">
                <Header
                    text={"Testy"}
                    breakpointWidth={300}
                    link={[]}
                    excludeInfoTooltip={true}
                />

                <p className="sub-header" style={{ marginBottom: "25px" }}>
                    Všetky testy sú vykonané na reziduách z trénovacej množiny
                </p>

                <Header
                    text={"Ljung-Box test"}
                    breakpointWidth={400}
                    link={
                        "https://www.statsmodels.org/dev/generated/statsmodels.stats.diagnostic.acorr_ljungbox.html"
                    }
                    fontSizePx={25}
                    excludeInfoTooltip={true}
                />

                <ResultElement
                    actionInProgress={actionInProgress}
                    responseBody={{
                        message: "",
                        data: JSON.stringify(
                            responseBodyData["ljung_box_test"],
                        ),
                    }}
                />

                <Header
                    text={"ARCH test"}
                    breakpointWidth={300}
                    link={
                        "https://www.statsmodels.org/dev/generated/statsmodels.stats.diagnostic.het_arch.html"
                    }
                    fontSizePx={25}
                    excludeInfoTooltip={true}
                />

                <ResultElement
                    actionInProgress={actionInProgress}
                    responseBody={{
                        message: "",
                        data: JSON.stringify(responseBodyData["arch_test"]),
                    }}
                />
            </div>
        );
    };

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

            <ModelFullResult
                responseBody={responseBody}
                actionInProgress={actionInProgress}
                component={getTestsContent()}
            />
        </>
    );

    return <Layout component={content} />;
}

export default ArimaModel;
