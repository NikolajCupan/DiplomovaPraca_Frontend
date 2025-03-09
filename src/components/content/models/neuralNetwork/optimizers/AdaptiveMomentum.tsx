import NumberInput from "../../../../common/inputs/NumberInput.tsx";

import Grid from "@mui/material/Grid2";

interface AdaptiveMomentumFormProps {
    startingLearningRate: number;
    setStartingLearningRate: React.Dispatch<React.SetStateAction<number>>;

    learningRateDecay: number;
    setLearningRateDecay: React.Dispatch<React.SetStateAction<number>>;

    epsilon: number;
    setEpsilon: React.Dispatch<React.SetStateAction<number>>;

    beta1: number;
    setBeta1: React.Dispatch<React.SetStateAction<number>>;

    beta2: number;
    setBeta2: React.Dispatch<React.SetStateAction<number>>;
}

function AdaptiveMomentumForm(props: AdaptiveMomentumFormProps) {
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

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-bottom"
                        value={props.epsilon}
                        setValue={props.setEpsilon}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={true}
                        label={"Epsilon"}
                        defaultValue={0.0000001}
                        minValue={0}
                        maxValue={1}
                        step={0.0000005}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-bottom"
                        value={props.beta1}
                        setValue={props.setBeta1}
                        toggleable={false}
                        inputEnabled={true}
                        decimalValuesAllowed={true}
                        label={"Beta 1"}
                        defaultValue={0.9}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                    />
                </Grid>
            </Grid>

            <NumberInput
                value={props.beta2}
                setValue={props.setBeta2}
                toggleable={false}
                inputEnabled={true}
                decimalValuesAllowed={true}
                label={"Beta 2"}
                defaultValue={0.999}
                minValue={0}
                maxValue={1}
                step={0.001}
            />
        </>
    );
}

export default AdaptiveMomentumForm;
