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

interface PeriodogramFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function PeriodogramForm(props: PeriodogramFormProps) {
    const { openNotification, openSuitableNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [samplingFrequency, setSamplingFrequency] = React.useState<number>(1);
    const [samplingFrequencyEnabled, setSamplingFrequencyEnabled] =
        React.useState<boolean>(false);

    const [fft, setFft] = React.useState<number>(1);
    const [fftEnabled, setFftEnabled] = React.useState<boolean>(false);

    const [spectrum, setSpectrum] = React.useState<string>("");
    const [spectrumEnabled, setSpectrumEnabled] =
        React.useState<boolean>(false);

    const [scaling, setScaling] = React.useState<string>("");
    const [scalingEnabled, setScalingEnabled] = React.useState<boolean>(false);

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
            Helper.appendIfAvailable(
                formData,
                "fs",
                samplingFrequency,
                samplingFrequencyEnabled,
            );
            Helper.appendIfAvailable(formData, "nfft", fft, fftEnabled);
            Helper.appendIfAvailable(
                formData,
                "return_onesided",
                spectrum,
                spectrumEnabled,
            );
            Helper.appendIfAvailable(
                formData,
                "scaling",
                scaling,
                scalingEnabled,
            );

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.PERIODOGRAM,
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
                "Pri vykonávaní akcie nastala chyba",
                "white",
                "red",
            );
        }

        props.setActionInProgress(false);
    };

    return (
        <>
            <Header
                text={"Periodogram"}
                breakpointWidth={360}
                link={
                    "https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.periodogram.html"
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
                        value={samplingFrequency}
                        setValue={setSamplingFrequency}
                        toggleable={true}
                        inputEnabled={samplingFrequencyEnabled}
                        setInputEnabled={setSamplingFrequencyEnabled}
                        label={"Vzorkovacia frekvencia"}
                        defaultValue={1}
                        minValue={1}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={fft}
                        setValue={setFft}
                        toggleable={true}
                        inputEnabled={fftEnabled}
                        setInputEnabled={setFftEnabled}
                        decimalValuesAllowed={false}
                        label={"Veľkosť Fourierovej transformácie"}
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
                        label={"Spektrum"}
                        value={spectrum}
                        setValue={setSpectrum}
                        toggleable={true}
                        inputEnabled={spectrumEnabled}
                        setInputEnabled={setSpectrumEnabled}
                        menuItems={[
                            [Constants.STRING_TRUE, "Jednostranné"],
                            [Constants.STRING_FALSE, "Obojstranné"],
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Škálovanie"}
                        value={scaling}
                        setValue={setScaling}
                        toggleable={true}
                        inputEnabled={scalingEnabled}
                        setInputEnabled={setScalingEnabled}
                        menuItems={[
                            ["density", "Hustota"],
                            ["spectrum", "Spektrum"],
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

export default PeriodogramForm;
