import * as Constants from "../../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../../helpers/CookiesManager.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import * as Utility from "../../../../helpers/UtilityProvider.tsx";
import Header from "../../../common/elements/Header.tsx";
import ConfirmButton from "../../../common/inputs/ConfirmButton.tsx";
import DatasetSelector from "../../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../../common/inputs/NumberInput.tsx";
import SelectInput from "../../../common/inputs/SelectInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface HoltWinterModelFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function HoltWinterModelForm(props: HoltWinterModelFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [trainPercent, setTrainPercent] = React.useState<number>(80);
    const [seasonLength, setSeasonLength] = React.useState<number>(12);

    const [trendType, setTrendType] = React.useState<string>("add");
    const [seasonType, setSeasonType] = React.useState<string>("add");

    const [alpha, setAlpha] = React.useState<number>(0.15);
    const [beta, setBeta] = React.useState<number>(0.15);
    const [gamma, setGamma] = React.useState<number>(0.15);

    const [forecastCount, setForecastCount] = React.useState<number>(0);
    const [pValueTests, setPValueTests] = React.useState<number>(0.05);

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
            formData.append("season_length", seasonLength.toString());

            formData.append("trend_type", trendType);
            formData.append("season_type", seasonType);

            formData.append("alpha", alpha.toString());
            formData.append("beta", beta.toString());
            formData.append("gamma", gamma.toString());

            formData.append(
                Constants.FORECAST_COUNT_KEY,
                forecastCount.toString(),
            );
            formData.append("pValueTests", pValueTests.toString());

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.HOLT_WINTER,
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

                const responseBodyData: Record<string, any> = JSON.parse(
                    responseBody.data,
                );
                console.log(responseBodyData);

                props.setResponseBody(responseBody);
            } else {
                props.setResponseBody(null);
                openNotification(
                    responseBody.message.trim() === ""
                        ? "Pri vykonávaní testu nastala chyba"
                        : responseBody.message,
                    "white",
                    "red",
                );
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
                text={"Exponenciálne vyrovnávanie Holt-Winter"}
                breakpointWidth={760}
                link={
                    "https://www.statsmodels.org/dev/generated/statsmodels.tsa.holtwinters.ExponentialSmoothing.html"
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
                        value={seasonLength}
                        setValue={setSeasonLength}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Dĺžka sezóny"}
                        defaultValue={12}
                        minValue={1}
                        step={1}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Typ trendu"}
                        value={trendType}
                        setValue={setTrendType}
                        toggleable={false}
                        inputEnabled={true}
                        menuItems={[
                            ["add", "Aditívny"],
                            ["mul", "Multiplikatívny"],
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Typ sezónnosti"}
                        value={seasonType}
                        setValue={setSeasonType}
                        toggleable={false}
                        inputEnabled={true}
                        menuItems={[
                            ["add", "Aditívna"],
                            ["mul", "Multiplikatívna"],
                        ]}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
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
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={gamma}
                        setValue={setGamma}
                        toggleable={false}
                        inputEnabled={true}
                        label={"Gamma"}
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

            <NumberInput
                customClass="custom-form-component-margin-top"
                value={pValueTests}
                setValue={setPValueTests}
                toggleable={false}
                inputEnabled={true}
                limitValuesAllowed={false}
                label={"Hladina významnosti testov"}
                defaultValue={0.05}
                minValue={0}
                maxValue={1}
                step={0.01}
            />

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

export default HoltWinterModelForm;
