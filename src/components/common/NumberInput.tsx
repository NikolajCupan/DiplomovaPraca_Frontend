import { Checkbox, InputAdornment, TextField } from "@mui/material";

import * as React from "react";

interface NumberInputProps {
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;

    toggleable: boolean;
    inputEnabled: boolean;
    setInputEnabled?: React.Dispatch<React.SetStateAction<boolean>>;

    label: string;
    defaultValue: number;
    minValue: number;
    maxValue: number;
    step: number;

    customClass?: string;
    customStyle?: React.CSSProperties;
}

function NumberInput(props: NumberInputProps) {
    const handleChangeValue = (newValue: string) => {
        const numericValue = Number(newValue);
        if (isNaN(numericValue)) {
            return;
        }

        props.setValue(numericValue);
    };

    const handleBlur = (newValue: string) => {
        const numericValue = Number(newValue);
        if (isNaN(numericValue)) {
            return;
        }

        if (numericValue < props.minValue || numericValue > props.maxValue) {
            props.setValue(props.defaultValue);
        }
    };

    const handleInputEnabledChange = (enabled: boolean) => {
        if (props.setInputEnabled) {
            props.setInputEnabled(enabled);
        }
    };

    return (
        <TextField
            className={props.customClass}
            label={props.label}
            variant="outlined"
            style={{ ...props.customStyle, width: "100%" }}
            type="number"
            value={props.value}
            onChange={(event) => handleChangeValue(event.target.value)}
            onBlur={(event) => handleBlur(event.target.value)}
            disabled={!props.inputEnabled}
            slotProps={{
                htmlInput: {
                    type: "number",
                    max: props.maxValue,
                    min: props.minValue,
                    step: props.step,
                },
                input: {
                    endAdornment: props.toggleable ? (
                        <InputAdornment position="end">
                            <Checkbox
                                checked={props.inputEnabled}
                                onChange={(event) =>
                                    handleInputEnabledChange(
                                        event.target.checked,
                                    )
                                }
                            />
                        </InputAdornment>
                    ) : null,
                },
            }}
        />
    );
}

export default NumberInput;
