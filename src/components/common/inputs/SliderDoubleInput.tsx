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
    const [displayedValue, setDisplayedValue] = React.useState<number[]>([]);
    const initialMinValue = React.useRef(Math.floor(props.minValue));
    const initialMaxValue = React.useRef(Math.ceil(props.maxValue));

    React.useEffect(() => {
        setDisplayedValue([
            Math.floor(props.value[0]),
            Math.ceil(props.value[1]),
        ]);
    }, []);

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
        setDisplayedValue([left, right]);
    };

    return (
        <Slider
            value={displayedValue}
            min={initialMinValue.current}
            max={initialMaxValue.current}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
            disableSwap
        />
    );
}

export default SliderDoubleInput;
