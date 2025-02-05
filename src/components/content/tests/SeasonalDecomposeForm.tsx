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
import TextInput from "../../common/inputs/TextInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface SeasonalDecomposeFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function SeasonalDecomposeForm(props: SeasonalDecomposeFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);
    const [selectedDatasetFrequency, setSelectedDatasetFrequency] =
        React.useState<string>("");

    const [period, setPeriod] = React.useState<number>(1);

    const [modelType, setModelType] = React.useState<string>("");
    const [modelTypeEnabled, setModelTypeEnabled] =
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
            formData.append("period", period.toString());
            Helper.appendIfAvailable(
                formData,
                "model",
                modelType,
                modelTypeEnabled,
            );

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.SEASONAL_DECOMPOSE,
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
                        ? "Pri vykonávaní akcie nastala chyba"
                        : responseBody.message,
                    "white",
                    "red",
                );
            }
        } catch {
            props.setResponseBody(null);
            openNotification(
                "Pri vykonávaní akcie nastala chyba",
                "white",
                "red",
            );
        }

        props.setActionInProgress(false);
    };

    React.useEffect(() => {
        if (selectedDatasetInfo) {
            setSelectedDatasetFrequency(
                Helper.translateFrequency(selectedDatasetInfo.frequencyType),
            );
        } else {
            setSelectedDatasetFrequency("");
        }
    }, [selectedDatasetInfo]);

    return (
        <>
            <Header
                text={"Dekompozícia časového radu"}
                breakpointWidth={600}
                link={
                    "https://www.statsmodels.org/dev/generated/statsmodels.tsa.seasonal.seasonal_decompose.html"
                }
            />

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 9 }}>
                    <DatasetSelector
                        datasetInfos={datasetInfos}
                        setDatasetInfos={setDatasetInfos}
                        selectedDatasetInfo={selectedDatasetInfo}
                        setSelectedDatasetInfo={setSelectedDatasetInfo}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                    <TextInput
                        customClass="custom-form-component-margin-top-sm"
                        value={selectedDatasetFrequency}
                        setValue={setSelectedDatasetFrequency}
                        toggleable={false}
                        inputEnabled={true}
                        readOnly={true}
                        label={"Frekvencia"}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={period}
                        setValue={setPeriod}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Perióda časového radu"}
                        defaultValue={1}
                        minValue={1}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Typ sezónnosti"}
                        value={modelType}
                        setValue={setModelType}
                        toggleable={true}
                        inputEnabled={modelTypeEnabled}
                        setInputEnabled={setModelTypeEnabled}
                        menuItems={[
                            ["additive", "Aditívna"],
                            ["multiplicative", "Multiplikatívna"],
                        ]}
                    />
                </Grid>
            </Grid>

            <ConfirmButton
                action={handleConfirmButtonClick}
                text={"Spracovať časový rad"}
                customClass="custom-form-component-margin-top custom-form-component-margin-bottom-small"
                toggleable={false}
                submitEnabled={!props.actionInProgress}
            />
        </>
    );
}

export default SeasonalDecomposeForm;
