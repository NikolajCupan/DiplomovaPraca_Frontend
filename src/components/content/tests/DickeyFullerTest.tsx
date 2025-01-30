import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import DatasetSelector from "../../common/DatasetSelector.tsx";
import NumberInput from "../../common/NumberInput.tsx";
import SelectInput from "../../common/SelectInput.tsx";
import Layout from "../../layout/Layout.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

function DickerFullerTest() {
    const { openNotification } = Utility.useUtility();

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [pValue, setPValue] = React.useState<number>(0);

    const [maxLag, setMaxLag] = React.useState<number>(0);
    const [maxLagEnabled, setMaxLagEnabled] = React.useState<boolean>(true);

    const [regression, setRegression] = React.useState<string>("");
    const [regressionEnabled, setRegressionEnabled] =
        React.useState<boolean>(false);

    const handleSubmit = async () => {
        console.log(pValue);
        console.log(maxLag);
        console.log(maxLagEnabled);
        console.log(regression);
        console.log(regressionEnabled);

        if (!selectedDatasetInfo) {
            return;
        }

        let success: boolean = true;
        let responseBodyData: JSON = {} as JSON;

        try {
            const formData = new FormData();
            formData.append(
                "idDataset",
                selectedDatasetInfo.idDataset.toString(),
            );
            formData.append("pValue", pValue.toString());

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

                const responseBody =
                    (await response.json()) as Type.RequestResult;
                responseBodyData = JSON.parse(responseBody.data);
            } else {
                success = false;
            }
        } catch {
            success = false;
        }

        if (!success) {
            openNotification("Chyba pri vykonávaní testu", "white", "red");
            return;
        }

        console.log(responseBodyData);
    };

    const content = (
        <div>
            <DatasetSelector
                selectedDatasetInfo={selectedDatasetInfo}
                setSelectedDatasetInfo={setSelectedDatasetInfo}
            />

            <SelectInput
                label={"Regresia"}
                value={regression}
                setValue={setRegression}
                toggleable={true}
                inputEnabled={regressionEnabled}
                setInputEnabled={setRegressionEnabled}
                menuItems={[
                    ["c", "Konštanta"],
                    ["ct", "Konštanta, trend"],
                    ["ctt", "Konštanta, lineárny a kvadratický trend"],
                    ["n", "Bez konštanty a trendu"],
                ]}
            />

            <div style={{ marginBottom: "50px" }}></div>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        value={pValue}
                        setValue={setPValue}
                        toggleable={false}
                        inputEnabled={true}
                        label={"Hladina významnosti"}
                        defaultValue={0.15}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        value={maxLag}
                        setValue={setMaxLag}
                        toggleable={true}
                        inputEnabled={maxLagEnabled}
                        setInputEnabled={setMaxLagEnabled}
                        label={"Maximálny lag"}
                        defaultValue={0.05}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                    />
                </Grid>
            </Grid>

            <button onClick={handleSubmit}>click</button>
        </div>
    );

    return <Layout component={content} />;
}

export default DickerFullerTest;
