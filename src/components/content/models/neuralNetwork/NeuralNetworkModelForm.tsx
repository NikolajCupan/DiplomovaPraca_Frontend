import * as Constants from "../../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../../helpers/Helper.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import * as Utility from "../../../../helpers/UtilityProvider.tsx";
import "../../../../index.css";
import Header from "../../../common/elements/Header.tsx";
import CustomButton from "../../../common/inputs/CustomButton.tsx";
import DatasetSelector from "../../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../../common/inputs/NumberInput.tsx";
import SelectInput from "../../../common/inputs/SelectInput.tsx";
import AddDropoutLayerForm from "./AddDropoutLayerForm.tsx";
import AddHiddenLayerForm from "./AddHiddenLayerForm.tsx";
import "./NeuralNetworkModelForm.css";
import * as NeuralNetworkTypes from "./NeuralNetworkModelTypes.tsx";
import AdaptiveGradientForm from "./optimizers/AdaptiveGradientForm.tsx";
import AdaptiveMomentumForm from "./optimizers/AdaptiveMomentum.tsx";
import RootMeanSquarePropagationForm from "./optimizers/RootMeanSquarePropagationForm.tsx";
import StochasticGradientDescentForm from "./optimizers/StochasticGradientDescentForm.tsx";
import StochasticGradientDescentWithMomentumForm from "./optimizers/StochasticGradientDescentWithMomentumForm.tsx";

import AddIcon from "@mui/icons-material/Add";
import BlurLinearIcon from "@mui/icons-material/BlurLinear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import GrainIcon from "@mui/icons-material/Grain";
import {
    Box,
    Button,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import * as React from "react";

interface NeuralNetworkModelFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function NeuralNetworkModel(props: NeuralNetworkModelFormProps) {
    const {
        openDialog,
        closeDialog,
        openNotification,
        openSuitableNotification,
    } = Utility.useUtility();

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

    const [layers, setLayers] = React.useState<
        Map<number, NeuralNetworkTypes.Layer>
    >(new Map());

    const addLayer = (newLayer: NeuralNetworkTypes.Layer) => {
        if (layers.size === 0) {
            const map: Map<number, NeuralNetworkTypes.Layer> = new Map();
            map.set(0, newLayer);

            setLayers(map);
        } else {
            const map: Map<number, NeuralNetworkTypes.Layer> = layers;
            const lastEntry = Array.from(layers.entries()).pop();
            const maxKey = lastEntry![0];

            map.set(maxKey + 1, newLayer);
            setLayers(map);
        }
    };

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
            <div className="custom-border">{optimizerContent}</div>
        );
    }

    const handleAddLayerButtonClick = () => {
        const content = (
            <>
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "22px",
                        marginBottom: "20px",
                    }}
                >
                    Zvoľte typ novej vrstvy
                </div>

                <div className="button-center" style={{ marginBottom: "20px" }}>
                    <Button
                        style={{ width: "100%" }}
                        variant="contained"
                        endIcon={<GrainIcon />}
                        size="large"
                        onClick={handleAddHiddenLayerButtonClick}
                    >
                        Hidden
                    </Button>
                </div>

                <div className="button-center">
                    <Button
                        style={{ width: "100%" }}
                        variant="contained"
                        endIcon={<BlurLinearIcon />}
                        size="large"
                        onClick={handleAddDropoutLayerButtonClick}
                    >
                        Dropout
                    </Button>
                </div>
            </>
        );

        openDialog(content, true, "xs");
    };

    const handleAddHiddenLayerButtonClick = () => {
        openDialog(<AddHiddenLayerForm addLayer={addLayer} />, true, "md");
    };

    const handleAddDropoutLayerButtonClick = () => {
        let dropoutLayerCanBeAdded = true;
        if (layers.size === 0) {
            dropoutLayerCanBeAdded = false;
        } else {
            const lastEntry = Array.from(layers.entries()).pop();

            if (!isHiddenLayer(lastEntry![1])) {
                dropoutLayerCanBeAdded = false;
            }
        }

        if (dropoutLayerCanBeAdded) {
            openDialog(<AddDropoutLayerForm addLayer={addLayer} />, true, "md");
        } else {
            openNotification(
                "Dropout layer musí byť umiestnený po hidden layer",
                "white",
                "red",
            );
        }
    };

    const isHiddenLayer = (layer: NeuralNetworkTypes.Layer) => {
        return "activationFunction" in layer;
    };

    const handleLayerDelete = (_: any, key: number) => {
        const map: Map<number, NeuralNetworkTypes.Layer> = layers;
        const newMap: Map<number, NeuralNetworkTypes.Layer> = new Map();

        map.forEach((layer: NeuralNetworkTypes.Layer, mapKey: number) => {
            if (mapKey < key) {
                newMap.set(mapKey, layer);
            }
        });

        setLayers(newMap);
        closeDialog();
        openNotification("Vrstva bola úspešne zmazaná", "white", "green");
    };

    const confirmLayerDelete = (
        layer: NeuralNetworkTypes.Layer,
        key: number,
    ) => {
        const content = (
            <>
                <p
                    style={{
                        marginTop: "0",
                        fontWeight: "bold",
                        fontSize: "25px",
                        textAlign: "center",
                    }}
                >
                    Potvrdenie zmazania
                </p>
                <p>
                    Ste si istý, že chcete vymazať danú vrstvu? Zmazanie vrstvy
                    spôsobi zmazanie všetkých nasledujúcich vrstiev
                </p>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "30px",
                    }}
                >
                    <Button
                        type="submit"
                        size="medium"
                        variant="contained"
                        onClick={closeDialog}
                        style={{ backgroundColor: "green" }}
                    >
                        Zrušiť
                    </Button>
                    <Button
                        type="submit"
                        size="medium"
                        variant="contained"
                        style={{ backgroundColor: "red" }}
                        onClick={() => handleLayerDelete(layer, key)}
                    >
                        Zmazať
                    </Button>
                </Box>
            </>
        );

        openDialog(content, true, "xs");
    };

    const getHiddenLayerElement = (
        layer: NeuralNetworkTypes.HiddenLayer,
        key: number,
    ) => {
        const primaryTextElement = (
            <>
                <span
                    style={{
                        color: "var(--primary-color)",
                        fontWeight: "bold",
                    }}
                >
                    Hidden layer
                </span>
                <br></br>
                <span>Počet neurónov: </span>
                <span style={{ fontWeight: "bold" }}>{layer.neuronsCount}</span>
                <br></br>
                <span>Aktivačná funkcia: </span>
                <span style={{ fontWeight: "bold" }}>
                    {layer.activationFunction.replace("_", " ")}
                </span>
                {layer.activationFunction === "leaky_relu" && (
                    <span>
                        {" "}
                        (sklon: {layer.activationFunctionParameters["slope"]})
                    </span>
                )}
            </>
        );

        const secondaryTextElement = (
            <>
                {layer.biasesRegularizerL1 !== 0 && (
                    <>
                        <span>Biases regularizer L1: </span>
                        <span style={{ fontWeight: "bold" }}>
                            {layer.biasesRegularizerL1}
                        </span>
                        <br></br>
                    </>
                )}
                {layer.biasesRegularizerL2 !== 0 && (
                    <>
                        <span>Biases regularizer L2: </span>
                        <span style={{ fontWeight: "bold" }}>
                            {layer.biasesRegularizerL2}
                        </span>
                        <br></br>
                    </>
                )}
                {layer.weightsRegularizerL1 !== 0 && (
                    <>
                        <span>Weights regularizer L1: </span>
                        <span style={{ fontWeight: "bold" }}>
                            {layer.weightsRegularizerL1}
                        </span>
                        <br></br>
                    </>
                )}
                {layer.weightsRegularizerL2 !== 0 && (
                    <>
                        <span>Weights regularizer L2: </span>
                        <span style={{ fontWeight: "bold" }}>
                            {layer.weightsRegularizerL2}
                        </span>
                        <br></br>
                    </>
                )}
            </>
        );

        return (
            <ListItem
                key={key}
                secondaryAction={
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                            confirmLayerDelete(layer, key);
                        }}
                    >
                        <DeleteForeverIcon color="primary" />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <GrainIcon color="primary" />
                </ListItemAvatar>
                <ListItemText
                    primary={primaryTextElement}
                    secondary={secondaryTextElement}
                />
            </ListItem>
        );
    };

    const getDropoutLayerElement = (
        layer: NeuralNetworkTypes.DropoutLayer,
        key: number,
    ) => {
        return (
            <ListItem
                key={key}
                secondaryAction={
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                            confirmLayerDelete(layer, key);
                        }}
                    >
                        <DeleteForeverIcon color="primary" />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <BlurLinearIcon color="primary" />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <span
                            style={{
                                color: "var(--primary-color)",
                                fontWeight: "bold",
                            }}
                        >
                            Dropout layer
                        </span>
                    }
                    secondary={
                        <>
                            <span>Percento zachovaných neurónov: </span>
                            <span style={{ fontWeight: "bold" }}>
                                {layer.keepRate} %
                            </span>
                        </>
                    }
                />
            </ListItem>
        );
    };

    const getLayerElements = () => {
        const content: React.ReactNode[] = [];

        layers.forEach((layer: NeuralNetworkTypes.Layer, key: number) => {
            if (isHiddenLayer(layer)) {
                content.push(
                    getHiddenLayerElement(
                        layer as NeuralNetworkTypes.HiddenLayer,
                        key,
                    ),
                );
            } else {
                content.push(
                    getDropoutLayerElement(
                        layer as NeuralNetworkTypes.DropoutLayer,
                        key,
                    ),
                );
            }
        });

        return content;
    };

    const handleConfirmButtonClick = async () => {
        if (props.actionInProgress) {
            return;
        }

        if (!selectedDatasetInfo) {
            openNotification("Zvoľte dataset", "white", "red");
            return;
        } else if (layers.size === 0) {
            openNotification(
                "Neurónová sieť musí obsahovať aspoň jednu vrstvu",
                "white",
                "red",
            );
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
            formData.append(
                Constants.FORECAST_COUNT_KEY,
                forecastCount.toString(),
            );

            formData.append("input_window_size", inputWindowSize.toString());
            Helper.appendIfAvailable(
                formData,
                "batch_size",
                batchSize,
                batchSizeEnabled,
            );

            formData.append("epoch_count", epochCount.toString());

            // Optimizers
            formData.append("optimizer", optimizer);

            formData.append(
                "starting_learning_rate",
                startingLearningRate.toString(),
            );
            formData.append(
                "learning_rate_decay",
                learningRateDecay.toString(),
            );
            formData.append("epsilon", epsilon.toString());
            formData.append("beta1", beta1.toString());
            formData.append("beta2", beta2.toString());
            formData.append("rho", rho.toString());
            formData.append("momentum", momentum.toString());
            // Optimizers end

            formData.append("loss_function", lossFunction);
            formData.append(
                "max_percentage_difference",
                maxPercentageDifference.toString(),
            );

            const processedLayers: string[] = processLayers(layers);
            formData.append("layers", JSON.stringify(processedLayers));

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.NEURAL_NETWORK,
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
        } catch (ex) {
            console.log(ex);
            props.setResponseBody(null);
            openNotification(
                "Pri vykonávaní akcie nastala chyba",
                "white",
                "red",
            );
        }

        props.setActionInProgress(false);
    };

    const processLayers = (
        layers: Map<number, NeuralNetworkTypes.Layer>,
    ): string[] => {
        const processedLayers: string[] = [];

        layers.forEach((layer: NeuralNetworkTypes.Layer, _: any) => {
            const processedLayer: Record<string, string> = {};

            if (isHiddenLayer(layer)) {
                const hiddenLayer = layer as NeuralNetworkTypes.HiddenLayer;

                processedLayer["type"] = "hidden";
                processedLayer["activation_function"] =
                    hiddenLayer.activationFunction;
                processedLayer["neurons_count"] =
                    hiddenLayer.neuronsCount.toString();

                processedLayer["biases_regularizer_l1"] =
                    hiddenLayer.biasesRegularizerL1.toString();
                processedLayer["biases_regularizer_l2"] =
                    hiddenLayer.biasesRegularizerL2.toString();
                processedLayer["weights_regularizer_l1"] =
                    hiddenLayer.weightsRegularizerL1.toString();
                processedLayer["weights_regularizer_l2"] =
                    hiddenLayer.weightsRegularizerL2.toString();

                if (hiddenLayer.activationFunction === "leaky_relu") {
                    processedLayer["slope"] =
                        hiddenLayer.activationFunctionParameters["slope"];
                }
            } else {
                const dropoutLayer = layer as NeuralNetworkTypes.DropoutLayer;

                processedLayer["type"] = "dropout";
                processedLayer["keep_rate"] = dropoutLayer.keepRate.toString();
            }

            processedLayers.push(JSON.stringify(processedLayer));
        });

        return processedLayers;
    };

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

            <CustomButton
                action={handleAddLayerButtonClick}
                text={"Pridať novú vrstvu"}
                customClass="custom-form-component-margin-top custom-form-component-margin-bottom"
                toggleable={false}
                submitEnabled={!props.actionInProgress}
                icon={<AddIcon />}
            />

            {layers.size === 0 ? (
                <div className="custom-border" style={{ textAlign: "center" }}>
                    Neurónová sieť aktuálne neobsahuje žiadne vstvy
                </div>
            ) : (
                <ul
                    style={{ marginTop: "0", marginBottom: "0" }}
                    className="custom-border"
                >
                    <>{getLayerElements()}</>
                </ul>
            )}

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

export default NeuralNetworkModel;
