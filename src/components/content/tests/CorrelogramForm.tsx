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

interface CorrelogramFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: [Type.RequestResult, Type.RequestResult] | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<[Type.RequestResult, Type.RequestResult] | null>
    >;
}

function CorrelogramForm(props: CorrelogramFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    // ACF
    const [autocovariance, setAutocovariance] = React.useState<string>("");
    const [autocovarianceEnabled, setAutocovarianceEnabled] =
        React.useState<boolean>(false);

    const [lagsCountAcf, setLagsCountAcf] = React.useState<number>(1);
    const [lagsCountAcfEnabled, setLagsCountAcfEnabled] =
        React.useState<boolean>(false);

    const [useFft, setUseFft] = React.useState<string>("");
    const [useFftEnabled, setUseFftEnabled] = React.useState<boolean>(false);

    const [alfaAcf, setAlfaAcf] = React.useState<number>(0.05);
    const [alfaAcfEnabled, setAlfaAcfEnabled] = React.useState<boolean>(false);

    const [useBartlettFormula, setUseBartlettFormula] =
        React.useState<string>("");
    const [useBartlettFormulaEnabled, setUseBartlettFormulaEnabled] =
        React.useState<boolean>(false);
    // ACF END

    // PACF
    const [lagsCountPacf, setLagsCountPacf] = React.useState<number>(1);
    const [lagsCountPacfEnabled, setLagsCountPacfEnabled] =
        React.useState<boolean>(false);

    const [method, setMethod] = React.useState<string>("");
    const [methodEnabled, setMethodEnabled] = React.useState<boolean>(false);

    const [alfaPacf, setAlfaPacf] = React.useState<number>(0.05);
    const [alfaPacfEnabled, setAlfaPacfEnabled] =
        React.useState<boolean>(false);
    // PACF ENd

    const handleAcfRequest = async () => {
        const formData = new FormData();
        formData.append("idDataset", selectedDatasetInfo!.idDataset.toString());
        Helper.appendIfAvailable(
            formData,
            "adjusted",
            autocovariance,
            autocovarianceEnabled,
        );
        Helper.appendIfAvailable(
            formData,
            "nlags",
            lagsCountAcf,
            lagsCountAcfEnabled,
        );
        Helper.appendIfAvailable(formData, "fft", useFft, useFftEnabled);
        Helper.appendIfAvailable(formData, "alpha", alfaAcf, alfaAcfEnabled);
        Helper.appendIfAvailable(
            formData,
            "bartlett_confint",
            useBartlettFormula,
            useBartlettFormulaEnabled,
        );

        const request: Type.FetchRequest = {
            url: Constants.BACKEND_PATH + Constants.CORRELOGRAM_ACF,
            options: {
                method: "post",
                body: formData,
            },
        };

        CookiesManager.prepareRequest(request);
        return await fetch(request.url, request.options);
    };

    const handlePacfRequest = async () => {
        const formData = new FormData();
        formData.append("idDataset", selectedDatasetInfo!.idDataset.toString());
        Helper.appendIfAvailable(
            formData,
            "nlags",
            lagsCountPacf,
            lagsCountPacfEnabled,
        );
        Helper.appendIfAvailable(formData, "method", method, methodEnabled);
        Helper.appendIfAvailable(formData, "alpha", alfaPacf, alfaPacfEnabled);

        const request: Type.FetchRequest = {
            url: Constants.BACKEND_PATH + Constants.CORRELOGRAM_PACF,
            options: {
                method: "post",
                body: formData,
            },
        };

        CookiesManager.prepareRequest(request);
        return await fetch(request.url, request.options);
    };

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
            const acfResponse = await handleAcfRequest();
            const pacfResponse = await handlePacfRequest();

            if (!acfResponse.ok || !pacfResponse.ok) {
                props.setResponseBody(null);
                openNotification(
                    "Pri vykonávaní akcie nastala chyba",
                    "white",
                    "red",
                );
                return;
            }

            CookiesManager.processResponse(acfResponse);
            CookiesManager.processResponse(pacfResponse);

            const acfResponseBody =
                (await acfResponse.json()) as Type.RequestResult;
            const pacfResponseBody =
                (await pacfResponse.json()) as Type.RequestResult;
            props.setResponseBody([acfResponseBody, pacfResponseBody]);
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
                text={"Korelogram"}
                breakpointWidth={360}
                link={[
                    [
                        "https://www.statsmodels.org/dev/generated/statsmodels.tsa.stattools.acf.html",
                        "ACF",
                    ],
                    [
                        "https://www.statsmodels.org/stable/generated/statsmodels.tsa.stattools.pacf.html",
                        "PACF",
                    ],
                ]}
            />

            <DatasetSelector
                datasetInfos={datasetInfos}
                setDatasetInfos={setDatasetInfos}
                selectedDatasetInfo={selectedDatasetInfo}
                setSelectedDatasetInfo={setSelectedDatasetInfo}
            />

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"(ACF) Autokovariancia"}
                        value={autocovariance}
                        setValue={setAutocovariance}
                        toggleable={true}
                        inputEnabled={autocovarianceEnabled}
                        setInputEnabled={setAutocovarianceEnabled}
                        menuItems={[
                            [Constants.STRING_TRUE, "n - k"],
                            [Constants.STRING_FALSE, "n"],
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={lagsCountAcf}
                        setValue={setLagsCountAcf}
                        toggleable={true}
                        inputEnabled={lagsCountAcfEnabled}
                        setInputEnabled={setLagsCountAcfEnabled}
                        decimalValuesAllowed={false}
                        label={"(ACF) Počet lagov"}
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
                        label={"(ACF) Použiť Fourierovú transformáciu"}
                        value={useFft}
                        setValue={setUseFft}
                        toggleable={true}
                        inputEnabled={useFftEnabled}
                        setInputEnabled={setUseFftEnabled}
                        menuItems={[
                            [Constants.STRING_TRUE, "Áno"],
                            [Constants.STRING_FALSE, "Nie"],
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={alfaAcf}
                        setValue={setAlfaAcf}
                        toggleable={true}
                        inputEnabled={alfaAcfEnabled}
                        setInputEnabled={setAlfaAcfEnabled}
                        limitValuesAllowed={false}
                        label={"(ACF) Hladina významnosti"}
                        defaultValue={0.05}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"(ACF) Použiť Bartlettovú formulu"}
                        value={useBartlettFormula}
                        setValue={setUseBartlettFormula}
                        toggleable={true}
                        inputEnabled={useBartlettFormulaEnabled}
                        setInputEnabled={setUseBartlettFormulaEnabled}
                        menuItems={[
                            [Constants.STRING_TRUE, "Áno"],
                            [Constants.STRING_FALSE, "Nie"],
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={lagsCountPacf}
                        setValue={setLagsCountPacf}
                        toggleable={true}
                        inputEnabled={lagsCountPacfEnabled}
                        setInputEnabled={setLagsCountPacfEnabled}
                        decimalValuesAllowed={false}
                        label={"(PACF) Počet lagov"}
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
                        label={"(PACF) Metóda"}
                        value={method}
                        setValue={setMethod}
                        toggleable={true}
                        inputEnabled={methodEnabled}
                        setInputEnabled={setMethodEnabled}
                        menuItems={[
                            ["yw", "Yule-Walker s úpravou"],
                            ["ywm", "Yule-Walker bez úpravy"],
                            ["ols", "Metóda najmenších štvorcov"],
                            [
                                "ols-inefficient",
                                "Neefektívna metóda najmenších štvorcov",
                            ],
                            [
                                "ols-adjusted",
                                "Upravená metóda najmenších štvorcov",
                            ],
                            ["ld", "Levinson-Durbin s úpravou"],
                            ["ldb", "Levinson-Durbin bez úpravy"],
                            ["burg", "Burgov odhad čiastočnej autokorelácie"],
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={alfaPacf}
                        setValue={setAlfaPacf}
                        toggleable={true}
                        inputEnabled={alfaPacfEnabled}
                        setInputEnabled={setAlfaPacfEnabled}
                        limitValuesAllowed={false}
                        label={"(PACF) Hladina významnosti"}
                        defaultValue={0.05}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
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

export default CorrelogramForm;
