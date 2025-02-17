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

interface ArimaModelFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function ArimaModelForm(props: ArimaModelFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [trainPercent, setTrainPercent] = React.useState<number>(80);
    const [seasonLength, setSeasonLength] = React.useState<number>(12);

    const [normal_p, setNormal_p] = React.useState<number>(0);
    const [normal_d, setNormal_d] = React.useState<number>(0);
    const [normal_q, setNormal_q] = React.useState<number>(0);

    const [seasonal_p, setSeasonal_p] = React.useState<number>(0);
    const [seasonal_d, setSeasonal_d] = React.useState<number>(0);
    const [seasonal_q, setSeasonal_q] = React.useState<number>(0);

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

            formData.append("normal_p", normal_p.toString());
            formData.append("normal_d", normal_d.toString());
            formData.append("normal_q", normal_q.toString());

            formData.append("seasonal_p", seasonal_p.toString());
            formData.append("seasonal_d", seasonal_d.toString());
            formData.append("seasonal_q", seasonal_q.toString());

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.ARIMA,
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
                text={"ARIMA"}
                breakpointWidth={250}
                link={
                    "https://www.statsmodels.org/stable/generated/statsmodels.tsa.arima.model.ARIMA.html"
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
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={normal_p}
                        setValue={setNormal_p}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Parameter p"}
                        defaultValue={0}
                        minValue={0}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={normal_d}
                        setValue={setNormal_d}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Parameter d"}
                        defaultValue={0}
                        minValue={0}
                        step={1}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={normal_q}
                        setValue={setNormal_q}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Parameter q"}
                        defaultValue={0}
                        minValue={0}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={seasonal_p}
                        setValue={setSeasonal_p}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Sezónny parameter P"}
                        defaultValue={0}
                        minValue={0}
                        step={1}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={seasonal_d}
                        setValue={setSeasonal_d}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Sezónny parameter D"}
                        defaultValue={0}
                        minValue={0}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={seasonal_q}
                        setValue={setSeasonal_q}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Sezónny parameter Q"}
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

export default ArimaModelForm;
