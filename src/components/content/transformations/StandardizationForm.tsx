import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import Header from "../../common/elements/Header.tsx";
import CustomButton from "../../common/inputs/CustomButton.tsx";
import DatasetSelector from "../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../common/inputs/NumberInput.tsx";
import TextInput from "../../common/inputs/TextInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface StandardizationFormProps {
    selectedDatasetInfo: Type.DatasetInfo | null;
    setSelectedDatasetInfo: React.Dispatch<
        React.SetStateAction<Type.DatasetInfo | null>
    >;

    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function StandardizationForm(props: StandardizationFormProps) {
    const { openNotification, openSuitableNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [transformedDatasetName, setTransformedDatasetName] =
        React.useState<string>("");

    const [mean, setMean] = React.useState<number>(0);
    const [standardDeviation, setStandardDeviation] = React.useState<number>(1);

    const handleConfirmButtonClick = async () => {
        if (props.actionInProgress) {
            return;
        }

        if (
            !props.selectedDatasetInfo ||
            transformedDatasetName.trim() === ""
        ) {
            openNotification("Zvoľte parametre", "white", "red");
            return;
        }

        props.setActionInProgress(true);

        try {
            const formData = new FormData();
            formData.append(
                "idDataset",
                props.selectedDatasetInfo.idDataset.toString(),
            );
            formData.append(
                "transformedDatasetName",
                transformedDatasetName.trim(),
            );
            formData.append("mean", mean.toString());
            formData.append("standard_deviation", standardDeviation.toString());

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.STANDARDIZATION,
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

                const newDatasetInfo: Type.DatasetInfo = responseBody.data;
                const prevDatasetInfos = datasetInfos.slice();
                prevDatasetInfos.push(newDatasetInfo);

                setDatasetInfos(prevDatasetInfos);
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
                text={"Štandardizácia"}
                breakpointWidth={300}
                link={[]}
                excludeInfoTooltip={true}
            />

            <DatasetSelector
                datasetInfos={datasetInfos}
                setDatasetInfos={setDatasetInfos}
                selectedDatasetInfo={props.selectedDatasetInfo}
                setSelectedDatasetInfo={props.setSelectedDatasetInfo}
            />

            <TextInput
                customClass="custom-form-component-margin-top"
                value={transformedDatasetName}
                setValue={setTransformedDatasetName}
                toggleable={false}
                inputEnabled={true}
                label={"Názov transformovaného datasetu"}
            />

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        label={"Priemer"}
                        value={mean}
                        setValue={setMean}
                        toggleable={false}
                        inputEnabled={true}
                        defaultValue={0}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        label={"Smerodajná odchýlka"}
                        value={standardDeviation}
                        setValue={setStandardDeviation}
                        toggleable={false}
                        inputEnabled={true}
                        limitValuesAllowed={false}
                        defaultValue={1}
                        minValue={0}
                        step={1}
                    />
                </Grid>
            </Grid>

            <CustomButton
                action={handleConfirmButtonClick}
                text={"Vykonať akciu"}
                customClass="custom-form-component-margin-top custom-form-component-margin-bottom-small"
                toggleable={false}
                submitEnabled={!props.actionInProgress}
            />
        </>
    );
}

export default StandardizationForm;
