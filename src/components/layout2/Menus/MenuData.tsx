import DataObjectIcon from "@mui/icons-material/DataObject";
import Button from "@mui/material/Button";
import * as React from "react";

export default function CustomizedMenus() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <div>
            <Button
                className="menu-button"
                id="menu-data-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<DataObjectIcon />}
            >
                Dáta
            </Button>
        </div>
    );
}
