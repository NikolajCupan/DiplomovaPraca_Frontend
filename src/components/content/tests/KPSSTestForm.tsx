import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import Header from "../../common/elements/Header.tsx";
import ConfirmButton from "../../common/inputs/ConfirmButton.tsx";
import DatasetSelector from "../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../common/inputs/NumberInput.tsx";
import SelectInput from "../../common/inputs/SelectInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface KPSSTestFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function KPSSTestForm(props: KPSSTestFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [pValue, setPValue] = React.useState<number>(0.05);

    const [regression, setRegression] = React.useState<string>("");
    const [regressionEnabled, setRegressionEnabled] =
        React.useState<boolean>(false);

    const [lagsCount, setLagsCount] = React.useState<number>(1);
    const [lagsCountEnabled, setLagsCountEnabled] =
        React.useState<boolean>(false);

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
            Helper.appendIfAvailable(
                formData,
                "regression",
                regression,
                regressionEnabled,
            );
            Helper.appendIfAvailable(
                formData,
                "nlags",
                lagsCount,
                lagsCountEnabled,
            );

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.KPSS_TEST,
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
                props.setResponseBody(null);
                openNotification(
                    responseBody.message.trim() === ""
                        ? "Pri vykonávaní testu nastala neznáma chyba"
                        : responseBody.message,
                    "white",
                    "red",
                );
            }
        } catch {
            props.setResponseBody(null);
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
            <Header
                text={"Kwiatkowski-Phillips-Schmidt-Shin test (KPSS)"}
                breakpointWidth={880}
                link={
                    "https://www.statsmodels.org/dev/generated/statsmodels.tsa.stattools.kpss.html"
                }
            />

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
                        limitValuesAllowed={false}
                        label={"Hladina významnosti"}
                        defaultValue={0.05}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                    />
                </Grid>
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
                            ["c", "Dáta sú stacionárne okolo konštanty"],
                            ["ct", "Dáta sú stacionárne okolo trendu"],
                        ]}
                    />
                </Grid>
            </Grid>

            <NumberInput
                customClass="custom-form-component-margin-top"
                value={lagsCount}
                setValue={setLagsCount}
                toggleable={true}
                inputEnabled={lagsCountEnabled}
                setInputEnabled={setLagsCountEnabled}
                label={"Počet lagov"}
                defaultValue={1}
                minValue={1}
                step={1}
            />

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

export default KPSSTestForm;
