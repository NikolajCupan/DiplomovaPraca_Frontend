import * as Type from "../../../../helpers/Types.tsx";
import Header from "../../../common/elements/Header.tsx";
import ConfirmButton from "../../../common/inputs/ConfirmButton.tsx";
import DatasetSelector from "../../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../../common/inputs/NumberInput.tsx";
import SelectInput from "../../../common/inputs/SelectInput.tsx";

import Grid from "@mui/material/Grid2";

import React from "react";
import AdaptiveGradientForm from "./optimizers/AdaptiveGradientForm.tsx";
import AdaptiveMomentumForm from "./optimizers/AdaptiveMomentum.tsx";
import RootMeanSquarePropagationForm from "./optimizers/RootMeanSquarePropagationForm.tsx";
import StochasticGradientDescentForm from "./optimizers/StochasticGradientDescentForm.tsx";
import StochasticGradientDescentWithMomentumForm from "./optimizers/StochasticGradientDescentWithMomentumForm.tsx";

interface NeuralNetworkModelFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function NeuralNetworkModel(props: NeuralNetworkModelFormProps) {
    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [trainPercent, setTrainPercent] = React.useState<number>(80);
    const [forecastCount, setForecastCount] = React.useState<number>(0);

    const [inputWindowSize, setInputWindowSize] = React.useState<number>(10);

    const [batchSize, setBatchSize] = React.useState<number>(100);
    const [batchSizeEnabled, setBatchSizeEnabled] =
        React.useState<boolean>(false);

    const [epochCount, setEpochCount] = React.useState<number>(50);

    // Optimizers
    const [optimizer, setOptimizer] =
        React.useState<string>("adaptive_gradient");

    const [startingLearningRate, setStartingLearningRate] =
        React.useState<number>(0.001);
    const [learningRateDecay, setLearningRateDecay] =
        React.useState<number>(0.01);
    const [epsilon, setEpsilon] = React.useState<number>(0.0000001);
    const [beta1, setBeta1] = React.useState<number>(0.9);
    const [beta2, setBeta2] = React.useState<number>(0.999);
    const [rho, setRho] = React.useState<number>(0.9);
    const [momentum, setMomentum] = React.useState<number>(0.9);
    // Optimizers end

    const [lossFunction, setLossFunction] =
        React.useState<string>("mean_squared_error");
    const [maxPercentageDifference, setMaxPercentageDifference] =
        React.useState<number>(5);

    let optimizerContent = <></>;
    if (optimizer.trim() !== "") {
        switch (optimizer) {
            case "adaptive_gradient":
                optimizerContent = (
                    <AdaptiveGradientForm
                        startingLearningRate={startingLearningRate}
                        setStartingLearningRate={setStartingLearningRate}
                        learningRateDecay={learningRateDecay}
                        setLearningRateDecay={setLearningRateDecay}
                        epsilon={epsilon}
                        setEpsilon={setEpsilon}
                    />
                );
                break;
            case "adaptive_momentum":
                optimizerContent = (
                    <AdaptiveMomentumForm
                        startingLearningRate={startingLearningRate}
                        setStartingLearningRate={setStartingLearningRate}
                        learningRateDecay={learningRateDecay}
                        setLearningRateDecay={setLearningRateDecay}
                        epsilon={epsilon}
                        setEpsilon={setEpsilon}
                        beta1={beta1}
                        setBeta1={setBeta1}
                        beta2={beta2}
                        setBeta2={setBeta2}
                    />
                );
                break;
            case "root_mean_square_propagation":
                optimizerContent = (
                    <RootMeanSquarePropagationForm
                        startingLearningRate={startingLearningRate}
                        setStartingLearningRate={setStartingLearningRate}
                        learningRateDecay={learningRateDecay}
                        setLearningRateDecay={setLearningRateDecay}
                        epsilon={epsilon}
                        setEpsilon={setEpsilon}
                        rho={rho}
                        setRho={setRho}
                    />
                );
                break;
            case "stochastic_gradient_descent":
                optimizerContent = (
                    <StochasticGradientDescentForm
                        startingLearningRate={startingLearningRate}
                        setStartingLearningRate={setStartingLearningRate}
                        learningRateDecay={learningRateDecay}
                        setLearningRateDecay={setLearningRateDecay}
                    />
                );
                break;
            case "stochastic_gradient_descent_with_momentum":
                optimizerContent = (
                    <StochasticGradientDescentWithMomentumForm
                        startingLearningRate={startingLearningRate}
                        setStartingLearningRate={setStartingLearningRate}
                        learningRateDecay={learningRateDecay}
                        setLearningRateDecay={setLearningRateDecay}
                        momentum={momentum}
                        setMomentum={setMomentum}
                    />
                );
                break;
        }

        optimizerContent = (
            <div
                style={{
                    border: "1px dashed black",
                    borderRadius: "var(--default-border-radius)",
                    padding: "15px",
                }}
            >
                {optimizerContent}
            </div>
        );
    }

    const handleConfirmButtonClick = async () => {};

    return (
        <>
            <Header
                text={"Neurónová sieť"}
                breakpointWidth={350}
                excludeInfoTooltip={true}
                link={[]}
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

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={inputWindowSize}
                        setValue={setInputWindowSize}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Veľkosť vstupného okna"}
                        defaultValue={10}
                        minValue={1}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={batchSize}
                        setValue={setBatchSize}
                        toggleable={true}
                        inputEnabled={batchSizeEnabled}
                        setInputEnabled={setBatchSizeEnabled}
                        decimalValuesAllowed={false}
                        label={"Veľkosť dávky"}
                        defaultValue={100}
                        minValue={0}
                        step={1}
                    />
                </Grid>
            </Grid>

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={epochCount}
                        setValue={setEpochCount}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={false}
                        label={"Počet epoch"}
                        defaultValue={50}
                        minValue={1}
                        step={1}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top custom-form-component-margin-bottom"
                        label={"Optimalizátor"}
                        value={optimizer}
                        setValue={setOptimizer}
                        toggleable={false}
                        inputEnabled={true}
                        menuItems={[
                            ["adaptive_gradient", "Adaptive gradient"],
                            ["adaptive_momentum", "Adaptive momentum"],
                            [
                                "root_mean_square_propagation",
                                "Root mean square propagation",
                            ],
                            [
                                "stochastic_gradient_descent",
                                "Stochastic gradient descent",
                            ],
                            [
                                "stochastic_gradient_descent_with_momentum",
                                "Stochastic gradient descent with momentum",
                            ],
                        ]}
                    />
                </Grid>
            </Grid>

            {optimizerContent}

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                        customClass="custom-form-component-margin-top"
                        label={"Stratová funkcia"}
                        value={lossFunction}
                        setValue={setLossFunction}
                        toggleable={false}
                        inputEnabled={true}
                        menuItems={[
                            ["mean_squared_error", "Mean squared error"],
                            ["mean_absolute_error", "Mean absolute error"],
                        ]}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={maxPercentageDifference}
                        setValue={setMaxPercentageDifference}
                        toggleable={false}
                        inputEnabled={true}
                        label={"Maximálny percentuálny rozdiel"}
                        defaultValue={5}
                        minValue={0}
                        maxValue={100}
                        step={0.5}
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

export default NeuralNetworkModel;
