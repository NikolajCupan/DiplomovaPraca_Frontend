import { Checkbox, InputAdornment, TextField } from "@mui/material";
import * as React from "react";

interface TextInputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;

    readOnly?: boolean;
    toggleable: boolean;
    inputEnabled: boolean;
    setInputEnabled?: React.Dispatch<React.SetStateAction<boolean>>;

    label: string;

    customClass?: string;
    customStyle?: React.CSSProperties;
}

function TextInput(props: TextInputProps) {
    const handleChangeValue = (newValue: string) => {
        props.setValue(newValue);
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
            style={{
                ...props.customStyle,
                width: "100%",
                pointerEvents: props.readOnly ? "none" : "auto",
            }}
            type="text"
            value={props.value}
            onChange={(event) => handleChangeValue(event.target.value)}
            disabled={!props.inputEnabled}
            slotProps={{
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

export default TextInput;
