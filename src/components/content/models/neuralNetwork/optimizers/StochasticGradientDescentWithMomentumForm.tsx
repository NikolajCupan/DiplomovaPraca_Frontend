import NumberInput from "../../../../common/inputs/NumberInput.tsx";

import Grid from "@mui/material/Grid2";

interface StochasticGradientDescentWithMomentumFormProps {
    startingLearningRate: number;
    setStartingLearningRate: React.Dispatch<React.SetStateAction<number>>;

    learningRateDecay: number;
    setLearningRateDecay: React.Dispatch<React.SetStateAction<number>>;

    momentum: number;
    setMomentum: React.Dispatch<React.SetStateAction<number>>;
}

function StochasticGradientDescentWithMomentumForm(
    props: StochasticGradientDescentWithMomentumFormProps,
) {
    return (
        <>
            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-bottom"
                        value={props.startingLearningRate}
                        setValue={props.setStartingLearningRate}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={true}
                        label={"Začiatočná miera učenia"}
                        defaultValue={0.001}
                        minValue={0}
                        maxValue={1}
                        step={0.001}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-bottom"
                        value={props.learningRateDecay}
                        setValue={props.setLearningRateDecay}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={true}
                        label={"Pokles miery učenia"}
                        defaultValue={0.01}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                    />
                </Grid>
            </Grid>

            <NumberInput
                value={props.learningRateDecay}
                setValue={props.setLearningRateDecay}
                toggleable={false}
                inputEnabled={true}
                decimalValuesAllowed={true}
                label={"Momentum"}
                defaultValue={0.9}
                minValue={0}
                maxValue={1}
                step={0.01}
            />
        </>
    );
}

export default StochasticGradientDescentWithMomentumForm;
