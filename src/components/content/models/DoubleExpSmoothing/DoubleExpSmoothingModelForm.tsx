import * as Constants from "../../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../../helpers/CookiesManager.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import * as Utility from "../../../../helpers/UtilityProvider.tsx";
import Header from "../../../common/elements/Header.tsx";
import ConfirmButton from "../../../common/inputs/ConfirmButton.tsx";
import DatasetSelector from "../../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../../common/inputs/NumberInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface DoubleExpSmoothingModelFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function DoubleExpSmoothingModelForm(props: DoubleExpSmoothingModelFormProps) {
    const { openNotification, openSuitableNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [trainPercent, setTrainPercent] = React.useState<number>(80);

    const [alpha, setAlpha] = React.useState<number>(0.15);
    const [beta, setBeta] = React.useState<number>(0.15);

    const [forecastCount, setForecastCount] = React.useState<number>(0);

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

            formData.append("train_percent", trainPercent.toString());

            formData.append("alpha", alpha.toString());
            formData.append("beta", beta.toString());

            formData.append(
                Constants.FORECAST_COUNT_KEY,
                forecastCount.toString(),
            );

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.DOUBLE_EXP_SMOOTHING,
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
                text={"Dvojité exponenciálne vyrovnávanie"}
                breakpointWidth={700}
                link={
                    "https://www.statsmodels.org/dev/generated/statsmodels.tsa.holtwinters.Holt.html#statsmodels.tsa.holtwinters.Holt"
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
                        value={trainPercent}
                        setValue={setTrainPercent}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Percento trénovacích dát"}
                        defaultValue={80}
                        minValue={50}
                        maxValue={100}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={alpha}
                        setValue={setAlpha}
                        toggleable={false}
                        inputEnabled={true}
                        label={"Alfa"}
                        defaultValue={0}
                        minValue={0}
                        step={0.01}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={beta}
                        setValue={setBeta}
                        toggleable={false}
                        inputEnabled={true}
                        label={"Beta"}
                        defaultValue={0}
                        minValue={0}
                        step={0.01}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={forecastCount}
                        setValue={setForecastCount}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Počet predikcií"}
                        defaultValue={0}
                        minValue={0}
                        step={1}
                    />
                </Grid>
            </Grid>

            <ConfirmButton
                action={handleConfirmButtonClick}
                text={"Vykonať akciu"}
                customClass="custom-form-component-margin-top custom-form-component-margin-bottom-small"
                toggleable={false}
                submitEnabled={!props.actionInProgress}
            />
        </>
    );
}

export default DoubleExpSmoothingModelForm;
