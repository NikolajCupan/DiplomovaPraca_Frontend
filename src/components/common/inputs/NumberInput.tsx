import { Checkbox, InputAdornment, TextField } from "@mui/material";

import * as React from "react";

interface NumberInputProps {
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;

    readOnly?: boolean;
    toggleable: boolean;
    inputEnabled: boolean;
    setInputEnabled?: React.Dispatch<React.SetStateAction<boolean>>;

    label: string | React.ReactNode;
    defaultValue: number;
    forbiddenValues?: number[];
    limitValuesAllowed?: boolean;
    decimalValuesAllowed?: boolean;
    minValue?: number;
    maxValue?: number;
    step: number;

    customClass?: string;
    customStyle?: React.CSSProperties;
}

function NumberInput(props: NumberInputProps) {
    const [keepDefaultMaxWidth, setKeepDefaultMaxWidth] =
        React.useState<boolean>(props.value.toString().trim() !== "");

    const handleChangeValue = (newValue: string) => {
        const numericValue = Number(newValue);
        if (isNaN(numericValue)) {
            return;
        }

        if (
            props.decimalValuesAllowed === undefined ||
            props.decimalValuesAllowed
        ) {
            props.setValue(numericValue);
        } else {
            props.setValue(Math.floor(numericValue));
        }
    };

    const handleBlur = (newValue: string) => {
        const numericValue = Number(newValue);
        if (isNaN(numericValue)) {
            return;
        }

        if (
            props.forbiddenValues !== undefined &&
            props.forbiddenValues.indexOf(numericValue) > -1
        ) {
            props.setValue(props.defaultValue);
            return;
        }

        if (
            props.limitValuesAllowed === undefined ||
            props.limitValuesAllowed
        ) {
            if (
                (props.minValue !== undefined &&
                    numericValue < props.minValue) ||
                (props.maxValue !== undefined && numericValue > props.maxValue)
            ) {
                props.setValue(props.defaultValue);
            }
        } else {
            if (
                (props.minValue !== undefined &&
                    numericValue <= props.minValue) ||
                (props.maxValue !== undefined && numericValue >= props.maxValue)
            ) {
                props.setValue(props.defaultValue);
            }
        }
    };

    const handleInputEnabledChange = (enabled: boolean) => {
        if (props.setInputEnabled) {
            props.setInputEnabled(enabled);
        }
    };

    return (
        <TextField
            onFocus={() => {
                setKeepDefaultMaxWidth(true);
            }}
            className={props.customClass}
            label={props.label}
            variant="outlined"
            style={{ ...props.customStyle, width: "100%" }}
            type="number"
            value={props.value}
            onChange={(event) => handleChangeValue(event.target.value)}
            onBlur={(event) => {
                setKeepDefaultMaxWidth(props.value.toString().trim() !== "");
                handleBlur(event.target.value);
            }}
            disabled={!props.inputEnabled}
            slotProps={{
                inputLabel: {
                    sx: {
                        ...(keepDefaultMaxWidth
                            ? {}
                            : {
                                  maxWidth: `calc(100% - 80px) !important`,
                              }),
                    },
                },
                htmlInput: {
                    type: "number",
                    ...(props.maxValue !== undefined && {
                        max: props.maxValue,
                    }),
                    ...(props.minValue !== undefined && {
                        min: props.minValue,
                    }),
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
                    readOnly:
                        props.readOnly !== undefined ? props.readOnly : false,
                },
            }}
        />
    );
}

export default NumberInput;
