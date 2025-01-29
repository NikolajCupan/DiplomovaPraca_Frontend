import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Type from "../../../helpers/Types.tsx";
import DatasetSelector from "../../common/DatasetSelector.tsx";
import Layout from "../../layout/Layout.tsx";

import * as React from "react";

function DickerFullerTest() {
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);
    const [pValue, setPValue] = React.useState<string>(
        Constants.DEFAULT_P_VALUE.toString(),
    );

    const validatePValue = () => {
        const numericPValue = Number(pValue);
        if (isNaN(numericPValue) || numericPValue < 0 || numericPValue > 1) {
            setPValue(Constants.DEFAULT_P_VALUE.toString());
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedDatasetInfo) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append(
                "idDataset",
                selectedDatasetInfo.idDataset.toString(),
            );
            formData.append("pValue", pValue);

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.DICKEY_FULLER_TEST,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookiesManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookiesManager.processResponse(response);
            }
        } catch {}
    };

    const content = (
        <div>
            <DatasetSelector
                selectedDatasetInfo={selectedDatasetInfo}
                setSelectedDatasetInfo={setSelectedDatasetInfo}
            />

            <form action="#" method="post" onSubmit={handleSubmit}>
                <input
                    className="numeric-input-no-arrows"
                    type="number"
                    value={pValue}
                    onChange={(event) => setPValue(event.target.value)}
                    onBlur={validatePValue}
                />
                <button type="submit">Odoslať</button>
            </form>
        </div>
    );

    return <Layout component={content} />;
}

export default DickerFullerTest;
