import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import Header from "../../common/elements/Header.tsx";

import * as React from "react";

interface CorrelogramFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function CorrelogramForm(props: CorrelogramFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    return (
        <>
            <Header
                text={"Korelogram"}
                breakpointWidth={360}
                link={[
                    [
                        "https://www.statsmodels.org/dev/generated/statsmodels.tsa.stattools.acf.html",
                        "ACF",
                    ],
                    [
                        "https://www.statsmodels.org/stable/generated/statsmodels.tsa.stattools.pacf.html",
                        "PACF",
                    ],
                ]}
            />
        </>
    );
}

export default CorrelogramForm;
