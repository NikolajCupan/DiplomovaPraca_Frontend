import { Checkbox, MenuItem, TextField } from "@mui/material";

import * as React from "react";

interface SelectInputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;

    toggleable: boolean;
    inputEnabled: boolean;
    setInputEnabled?: React.Dispatch<React.SetStateAction<boolean>>;

    label: string;
    menuItems: [string, string][];

    customClass?: string;
    customStyle?: React.CSSProperties;
}

function SelectInput(props: SelectInputProps) {
    const [keepDefaultMaxWidth, setKeepDefaultMaxWidth] =
        React.useState<boolean>(props.value.trim() !== "");

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
            onBlur={() => {
                setKeepDefaultMaxWidth(props.value.trim() !== "");
            }}
            className={props.customClass}
            label={props.label}
            variant="outlined"
            style={{ ...props.customStyle, width: "100%" }}
            value={props.value}
            onChange={(event) => props.setValue(event.target.value)}
            disabled={!props.inputEnabled}
            slotProps={{
                inputLabel: {
                    sx: {
                        ...(keepDefaultMaxWidth
                            ? {}
                            : {
                                  maxWidth: `calc(100% - 80px) !important`,
                                  backgroundColor: "pink",
                              }),
                    },
                },
                input: {
                    sx: {
                        "& .MuiInputBase-input": {
                            paddingRight: "0 !important",
                        },
                    },
                    endAdornment: props.toggleable ? (
                        <Checkbox
                            checked={props.inputEnabled}
                            onChange={(event) =>
                                handleInputEnabledChange(event.target.checked)
                            }
                            disabled={false}
                            style={{
                                backgroundColor: "white",
                                height: "100%",
                            }}
                        />
                    ) : null,
                },
                select: {
                    IconComponent: () => <></>,
                },
            }}
            select
        >
            {props.menuItems.map(([key, value]) => (
                <MenuItem value={key} key={key}>
                    {value}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default SelectInput;
