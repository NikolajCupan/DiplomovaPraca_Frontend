import * as Constants from "../../../../helpers/Constants.tsx";
import NumberInput from "../../../common/inputs/NumberInput.tsx";
import SelectInput from "../../../common/inputs/SelectInput.tsx";
import * as NeuralNetworkTypes from "./NeuralNetworkModelTypes.tsx";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

import * as React from "react";

interface AddHiddenLayerFormProps {
    layers: NeuralNetworkTypes.Layer[];
    setLayers: React.Dispatch<React.SetStateAction<NeuralNetworkTypes.Layer[]>>;
}

function AddHiddenLayerForm(props: AddHiddenLayerFormProps) {
    const [neuronsCount, setNeuronsCount] = React.useState<number>(10);
    const [useRegularizer, setUseRegularizer] = React.useState<string>(
        Constants.STRING_FALSE,
    );

    const [biasesRegularizerL1, setBiasRegularizerL1] =
        React.useState<number>(0);
    const [biasesRegularizerL2, setBiasRegularizerL2] =
        React.useState<number>(0);
    const [weightsRegularizerL1, setWeightsRegularizerL1] =
        React.useState<number>(0);
    const [weightsRegularizerL2, setWeightsRegularizerL2] =
        React.useState<number>(0);

    const [activationFunction, setActivationFunction] =
        React.useState<string>("linear");
    const [slope, setSlope] = React.useState<number>(0.01);

    return (
        <>
            <div
                style={{
                    textAlign: "center",
                    fontSize: "22px",
                    marginBottom: "30px",
                }}
            >
                Zvoľte parametre vrstvy
            </div>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        value={neuronsCount}
                        setValue={setNeuronsCount}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Počet neurónov"}
                        defaultValue={10}
                        minValue={1}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-bottom custom-form-component-margin-top-sm"
                        label={"Optimalizátor"}
                        value={useRegularizer}
                        setValue={setUseRegularizer}
                        toggleable={false}
                        inputEnabled={true}
                        menuItems={[
                            [Constants.STRING_FALSE, "Nie"],
                            [Constants.STRING_TRUE, "Áno"],
                        ]}
                    />
                </Grid>
            </Grid>

            {useRegularizer === Constants.STRING_TRUE && (
                <div className="custom-form-component-margin-bottom custom-border">
                    <Grid container columnSpacing={4}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <NumberInput
                                value={biasesRegularizerL1}
                                setValue={setBiasRegularizerL1}
                                toggleable={false}
                                inputEnabled={true}
                                decimalValuesAllowed={false}
                                label={"Bias regularizer L1"}
                                defaultValue={0}
                                minValue={0}
                                maxValue={1}
                                step={0.001}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <NumberInput
                                customClass="custom-form-component-margin-top-sm"
                                value={biasesRegularizerL2}
                                setValue={setBiasRegularizerL2}
                                toggleable={false}
                                inputEnabled={true}
                                decimalValuesAllowed={false}
                                label={"Bias regularizer L2"}
                                defaultValue={0}
                                minValue={0}
                                maxValue={1}
                                step={0.001}
                            />
                        </Grid>
                    </Grid>

                    <Grid container columnSpacing={4}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <NumberInput
                                customClass="custom-form-component-margin-top"
                                value={weightsRegularizerL1}
                                setValue={setWeightsRegularizerL1}
                                toggleable={false}
                                inputEnabled={true}
                                decimalValuesAllowed={false}
                                label={"Weights regularizer L1"}
                                defaultValue={0}
                                minValue={0}
                                maxValue={1}
                                step={0.001}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <NumberInput
                                customClass="custom-form-component-margin-top"
                                value={weightsRegularizerL2}
                                setValue={setWeightsRegularizerL2}
                                toggleable={false}
                                inputEnabled={true}
                                decimalValuesAllowed={false}
                                label={"Weights regularizer L2"}
                                defaultValue={0}
                                minValue={0}
                                maxValue={1}
                                step={0.001}
                            />
                        </Grid>
                    </Grid>
                </div>
            )}

            <SelectInput
                customClass="custom-form-component-margin-bottom"
                label={"Aktivačná funkcia"}
                value={activationFunction}
                setValue={setActivationFunction}
                toggleable={false}
                inputEnabled={true}
                menuItems={[
                    ["linear", "Linear"],
                    ["relu", "ReLU"],
                    ["leaky_relu", "Leaky ReLU"],
                    ["sigmoid", "Sigmoid"],
                    ["tan_h", "Tanh"],
                ]}
            />

            {activationFunction === "leaky_relu" && (
                <div className="custom-form-component-margin-bottom custom-border">
                    <NumberInput
                        value={slope}
                        setValue={setSlope}
                        toggleable={false}
                        inputEnabled={true}
                        label={"Sklon"}
                        defaultValue={0.01}
                        minValue={0}
                        step={0.01}
                    />
                </div>
            )}

            <div className="button-center">
                <Button
                    style={{ width: "100%" }}
                    variant="contained"
                    endIcon={<AddIcon />}
                    size="large"
                >
                    Pridať vrstvu
                </Button>
            </div>
        </>
    );
}

export default AddHiddenLayerForm;
