import * as Type from "../../../../helpers/Types.tsx";
// import * as Utility from "../../../../helpers/UtilityProvider.tsx";
import Header from "../../../common/elements/Header.tsx";
import ConfirmButton from "../../../common/inputs/ConfirmButton.tsx";
import DatasetSelector from "../../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../../common/inputs/NumberInput.tsx";
import SelectInput from "../../../common/inputs/SelectInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface GarchModelFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function GarchModelForm(props: GarchModelFormProps) {
    // const { openNotification, openSuitableNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [trainPercent, setTrainPercent] = React.useState<number>(80);
    const [power, setPower] = React.useState<number>(2);

    const [meanModel, setMeanModel] = React.useState<string>("Constant");
    const [volatilityModel, setVolatilityModel] =
        React.useState<string>("GARCH");

    const [parameter_p, setParameter_p] = React.useState<number>(1);
    const [parameter_o, setParameter_o] = React.useState<number>(0);
    const [parameter_q, setParameter_q] = React.useState<number>(1);

    const [errorDistribution, setErrorDistribution] =
        React.useState<string>("normal");

    const handleConfirmButtonClick = () => {
        return;
    };

    return (
        <>
            <Header
                text={"GARCH"}
                breakpointWidth={250}
                link={
                    "https://arch.readthedocs.io/en/latest/univariate/introduction.html"
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
                        value={power}
                        setValue={setPower}
                        toggleable={false}
                        inputEnabled={true}
                        limitValuesAllowed={false}
                        label={"Mocnina"}
                        defaultValue={2}
                        minValue={0}
                        step={0.01}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Mean model"}
                        value={meanModel}
                        setValue={setMeanModel}
                        toggleable={false}
                        inputEnabled={true}
                        menuItems={[
                            ["Constant", "Constant"],
                            ["Zero", "Zero"],
                            ["LS", "LS"],
                            ["AR", "AR"],
                            ["ARX", "ARX"],
                            ["HAR", "HAR"],
                            ["HARX", "HARX"],
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Volatility model"}
                        value={volatilityModel}
                        setValue={setVolatilityModel}
                        toggleable={false}
                        inputEnabled={true}
                        menuItems={[
                            ["GARCH", "GARCH"],
                            ["ARCH", "ARCH"],
                            ["EGARCH", "EGARCH"],
                            ["FIGARCH", "FIGARCH"],
                            ["APARCH", "APARCH"],
                            ["HARCH", "HARCH"],
                        ]}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={parameter_p}
                        setValue={setParameter_p}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Parameter p"}
                        defaultValue={1}
                        minValue={0}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={parameter_o}
                        setValue={setParameter_o}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Parameter o"}
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
                        value={parameter_q}
                        setValue={setParameter_q}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Parameter q"}
                        defaultValue={1}
                        minValue={0}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Štatistické rozdelenie chýb"}
                        value={errorDistribution}
                        setValue={setErrorDistribution}
                        toggleable={false}
                        inputEnabled={true}
                        menuItems={[
                            ["normal", "Normálne"],
                            ["t", "Studentovo"],
                            ["skewt", "Asymetrické Studentovo"],
                            ["ged", "Generalizované rozdelenie chýb"],
                        ]}
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

export default GarchModelForm;
