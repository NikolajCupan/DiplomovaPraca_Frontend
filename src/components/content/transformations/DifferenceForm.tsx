import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import Header from "../../common/elements/Header.tsx";
import ConfirmButton from "../../common/inputs/ConfirmButton.tsx";
import DatasetSelector from "../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../common/inputs/NumberInput.tsx";
import TextInput from "../../common/inputs/TextInput.tsx";

import Grid from "@mui/material/Grid2";

import React from "react";

interface DifferenceFormProps {
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

function DifferenceForm(props: DifferenceFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [transformedDatasetName, setTransformedDatasetName] =
        React.useState<string>("");
    const [differenceLevel, setDifferenceLevel] = React.useState<number>(1);

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
            formData.append("differenceLevel", differenceLevel.toString());

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.DIFFERENCE,
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

                openNotification(
                    "Akcia bola úspešne vykonaná",
                    "white",
                    "green",
                );
            } else {
                props.setResponseBody(null);
                openNotification(
                    responseBody.message.trim() === ""
                        ? "Pri vykonávaní akcie nastala chyba"
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
                text={"Diferencia"}
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

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInput
                        customClass="custom-form-component-margin-top"
                        value={transformedDatasetName}
                        setValue={setTransformedDatasetName}
                        toggleable={false}
                        inputEnabled={true}
                        label={"Názov transformovaného datasetu"}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={differenceLevel}
                        setValue={setDifferenceLevel}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Level diferencie"}
                        defaultValue={1}
                        minValue={1}
                        maxValue={10}
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

export default DifferenceForm;
