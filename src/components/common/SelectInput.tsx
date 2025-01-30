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
}

function SelectInput(props: SelectInputProps) {
    const handleInputEnabledChange = (enabled: boolean) => {
        if (props.setInputEnabled) {
            props.setInputEnabled(enabled);
        }
    };

    return (
        <TextField
            label={props.label}
            variant="outlined"
            style={{ width: "100%" }}
            value={props.value}
            onChange={(event) => props.setValue(event.target.value)}
            disabled={!props.inputEnabled}
            slotProps={{
                input: {
                    endAdornment: (
                        <Checkbox
                            checked={props.inputEnabled}
                            onChange={(event) =>
                                handleInputEnabledChange(event.target.checked)
                            }
                            disabled={false}
                        />
                    ),
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
