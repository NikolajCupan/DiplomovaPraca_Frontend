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
            value={props.value}
            onChange={(event) => props.setValue(event.target.value)}
            disabled={!props.inputEnabled}
            slotProps={{
                input: {
                    endAdornment: props.toggleable ? (
                        <Checkbox
                            checked={props.inputEnabled}
                            onChange={(event) =>
                                handleInputEnabledChange(event.target.checked)
                            }
                            disabled={false}
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
