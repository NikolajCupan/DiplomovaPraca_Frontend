import Slider from "@mui/material/Slider";

import * as React from "react";

interface SliderDoubleInputProps {
    value: number[];
    setValue: React.Dispatch<React.SetStateAction<number[]>>;

    minValue: number;
    maxValue: number;
    minDistance: number;
}

function SliderDoubleInput(props: SliderDoubleInputProps) {
    const handleSliderChange = (
        _: any,
        newValues: number | number[],
        __: any,
    ) => {
        if (!Array.isArray(newValues)) {
            return;
        }

        const left = newValues[0];
        const right = newValues[1];
        const distance = right - left;

        if (distance < props.minDistance) {
            return;
        }

        props.setValue([left, right]);
    };

    return (
        <Slider
            value={props.value}
            min={props.minValue}
            max={props.maxValue}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
            disableSwap
        />
    );
}

export default SliderDoubleInput;
