import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import Header from "../../common/elements/Header.tsx";
import CustomButton from "../../common/inputs/CustomButton.tsx";
import DatasetSelector from "../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../common/inputs/NumberInput.tsx";
import SelectInput from "../../common/inputs/SelectInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface LjungBoxTestFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function LjungBoxTestFrom(props: LjungBoxTestFormProps) {
    const { openNotification, openSuitableNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [pValue, setPValue] = React.useState<number>(0.05);

    const [period, setPeriod] = React.useState<number>(2);
    const [periodEnabled, setPeriodEnabled] = React.useState<boolean>(false);

    const [lagsCount, setLagsCount] = React.useState<number>(1);
    const [lagsCountEnabled, setLagsCountEnabled] =
        React.useState<boolean>(false);

    const [autoLag, setAutoLag] = React.useState<string>("");
    const [autoLagEnabled, setAutoLagEnabled] = React.useState<boolean>(false);

    const [dfCount, setDfCount] = React.useState<number>(0);
    const [dfCountEnabled, setDfCountEnabled] = React.useState<boolean>(false);

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
            Helper.appendIfAvailable(formData, "period", period, periodEnabled);
            Helper.appendIfAvailable(
                formData,
                "lags",
                lagsCount,
                lagsCountEnabled,
            );
            Helper.appendIfAvailable(
                formData,
                "auto_lag",
                autoLag,
                autoLagEnabled,
            );
            Helper.appendIfAvailable(
                formData,
                "model_df",
                dfCount,
                dfCountEnabled,
            );

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.LJUNG_BOX_TEST,
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
                openSuitableNotification(response, responseBody);
            }
        } catch {
            props.setResponseBody(null);
            openNotification(
                "Pri vykonávaní testu nastala chyba",
                "white",
                "red",
            );
        }

        props.setActionInProgress(false);
    };

    return (
        <>
            <Header
                text={"Ljung-Box test"}
                breakpointWidth={400}
                link={
                    "https://www.statsmodels.org/dev/generated/statsmodels.stats.diagnostic.acorr_ljungbox.html"
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
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={period}
                        setValue={setPeriod}
                        toggleable={true}
                        inputEnabled={periodEnabled}
                        setInputEnabled={setPeriodEnabled}
                        label={"Perióda časového radu"}
                        defaultValue={2}
                        minValue={2}
                        step={1}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
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
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Automatický lag"}
                        value={autoLag}
                        setValue={setAutoLag}
                        toggleable={true}
                        inputEnabled={autoLagEnabled}
                        setInputEnabled={setAutoLagEnabled}
                        menuItems={[
                            [Constants.STRING_TRUE, "Automatický výber lagov"],
                            [
                                Constants.STRING_FALSE,
                                "Manuálne nastavenie lagov",
                            ],
                        ]}
                    />
                </Grid>
            </Grid>

            <NumberInput
                customClass="custom-form-component-margin-top"
                value={dfCount}
                setValue={setDfCount}
                toggleable={true}
                inputEnabled={dfCountEnabled}
                setInputEnabled={setDfCountEnabled}
                label={"Počet stupňov voľnosti"}
                defaultValue={0}
                minValue={0}
                step={1}
            />

            <CustomButton
                action={handleConfirmButtonClick}
                text={"Vykonať test"}
                customClass="custom-form-component-margin-top custom-form-component-margin-bottom-small"
                toggleable={false}
                submitEnabled={!props.actionInProgress}
            />
        </>
    );
}

export default LjungBoxTestFrom;
