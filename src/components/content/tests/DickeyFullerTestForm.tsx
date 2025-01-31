import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import ConfirmButton from "../../common/ConfirmButton.tsx";
import DatasetSelector from "../../common/DatasetSelector.tsx";
import FormTitle from "../../common/FormTitle.tsx";
import NumberInput from "../../common/NumberInput.tsx";
import SelectInput from "../../common/SelectInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface DickeyFullerTestFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function DickeyFullerTestForm(props: DickeyFullerTestFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [pValue, setPValue] = React.useState<number>(0.05);

    const [maxLag, setMaxLag] = React.useState<number>(1);
    const [maxLagEnabled, setMaxLagEnabled] = React.useState<boolean>(true);

    const [regression, setRegression] = React.useState<string>("");
    const [regressionEnabled, setRegressionEnabled] =
        React.useState<boolean>(false);

    const [autolag, setAutolag] = React.useState<string>("");
    const [autolagEnabled, setAutolagEnabled] = React.useState<boolean>(false);

    const handleConfirmButtonClick = async () => {
        if (props.actionInProgress) {
            return;
        }

        if (!selectedDatasetInfo) {
            openNotification("Zvoľte dataset", "white", "red");
            return;
        }

        props.setActionInProgress(true);

        try {
            const formData = new FormData();
            formData.append(
                "idDataset",
                selectedDatasetInfo.idDataset.toString(),
            );
            formData.append("pValue", pValue.toString());
            Helper.appendIfAvailable(formData, "maxLag", maxLag, maxLagEnabled);
            Helper.appendIfAvailable(
                formData,
                "regression",
                regression,
                regressionEnabled,
            );
            Helper.appendIfAvailable(
                formData,
                "autolag",
                autolag,
                autolagEnabled,
            );

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.DICKEY_FULLER_TEST,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookiesManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);
            const responseBody = (await response.json()) as Type.RequestResult;

            if (response.ok) {
                CookiesManager.processResponse(response);

                props.setResponseBody(responseBody);
            } else {
                openNotification(
                    responseBody.message.trim() === ""
                        ? "Pri vykonávaní testu nastala neznáma chyba"
                        : responseBody.message,
                    "white",
                    "red",
                );
            }
        } catch {
            openNotification(
                "Pri vykonávaní testu nastala neznáma chyba",
                "white",
                "red",
            );
        }

        props.setActionInProgress(false);
    };

    return (
        <>
            <FormTitle text={"Dickey-Fuller test"} />

            <DatasetSelector
                datasetInfos={datasetInfos}
                setDatasetInfos={setDatasetInfos}
                selectedDatasetInfo={selectedDatasetInfo}
                setSelectedDatasetInfo={setSelectedDatasetInfo}
            />

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={pValue}
                        setValue={setPValue}
                        toggleable={false}
                        inputEnabled={true}
                        label={"Hladina významnosti"}
                        defaultValue={0.05}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={maxLag}
                        setValue={setMaxLag}
                        toggleable={true}
                        inputEnabled={maxLagEnabled}
                        setInputEnabled={setMaxLagEnabled}
                        label={"Maximálny lag"}
                        defaultValue={1}
                        minValue={1}
                        step={1}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Autolag"}
                        value={autolag}
                        setValue={setAutolag}
                        toggleable={true}
                        inputEnabled={autolagEnabled}
                        setInputEnabled={setAutolagEnabled}
                        menuItems={[
                            ["AIC", "AIC"],
                            ["BIC", "BIC"],
                            ["t-stat", "t-stat"],
                            ["None", "Žiadny"],
                        ]}
                    />
                </Grid>
            </Grid>

            <ConfirmButton
                action={handleConfirmButtonClick}
                text={"Vykonať test"}
                customClass="custom-form-component-margin-top custom-form-component-margin-bottom-small"
                toggleable={false}
                submitEnabled={!props.actionInProgress}
            />
        </>
    );
}

export default DickeyFullerTestForm;
