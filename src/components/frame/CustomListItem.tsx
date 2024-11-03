import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import React from "react";

interface CustomListItemProps {
    text: string;
    open: boolean;
    icon: React.ReactNode;
}

export class CustomListItem extends React.Component<CustomListItemProps> {
    public render() {
        return (
            <ListItem
                key={this.props.text}
                disablePadding
                sx={{ display: "block" }}
            >
                <ListItemButton
                    sx={[
                        {
                            minHeight: 48,
                            px: 2.5,
                        },
                        this.props.open
                            ? { justifyContent: "initial" }
                            : { justifyContent: "center" },
                    ]}
                >
                    <ListItemIcon
                        sx={[
                            {
                                minWidth: 0,
                                justifyContent: "center",
                            },
                            this.props.open ? { mr: 3 } : { mr: "auto" },
                        ]}
                    >
                        {this.props.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={this.props.text}
                        sx={[this.props.open ? { opacity: 1 } : { opacity: 0 }]}
                    />
                </ListItemButton>
            </ListItem>
        );
    }
}

export default CustomListItem;
