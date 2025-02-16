import * as Constants from "../../../helpers/Constants.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";

import LightbulbIcon from "@mui/icons-material/Lightbulb";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";

import * as React from "react";

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: "var(--default-border-radius)",
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: "rgb(55, 65, 81)",
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            "&:active": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
        ...theme.applyStyles("dark", {
            color: theme.palette.grey[300],
        }),
    },
}));

export default function CustomizedMenus() {
    const { closeNotification } = Utility.useUtility();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        closeNotification();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        window.addEventListener("resize", handleClose);
        return () => {
            window.addEventListener("resize", handleClose);
        };
    }, []);

    return (
        <div>
            <Button
                className="menu-button"
                id="menu-models-button"
                aria-controls={open ? "menu-models" : undefined}
                aria-expanded={open ? "true" : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<LightbulbIcon />}
            >
                Modely
            </Button>
            <StyledMenu
                id="menu-models"
                MenuListProps={{
                    "aria-labelledby": "menu-models-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                className="mini-menu-items"
            >
                <a href={Constants.HOME_LINK}>
                    <MenuItem disableRipple>
                        <NavigateNextIcon style={{ color: "black" }} />
                        <div style={{ textWrap: "balance" }}>
                            Jednoduché exponenciálne vyrovnávanie
                        </div>
                    </MenuItem>
                </a>

                <a href={Constants.HOME_LINK}>
                    <MenuItem disableRipple>
                        <NavigateNextIcon style={{ color: "black" }} />
                        <div style={{ textWrap: "balance" }}>
                            Exponenciálne vyrovnávanie Holt-Winter
                        </div>
                    </MenuItem>
                </a>

                <a href={Constants.ARIMA_LINK}>
                    <MenuItem disableRipple>
                        <NavigateNextIcon style={{ color: "black" }} />
                        ARIMA
                    </MenuItem>
                </a>

                <a href={Constants.HOME_LINK}>
                    <MenuItem disableRipple>
                        <NavigateNextIcon style={{ color: "black" }} />
                        GARCH
                    </MenuItem>
                </a>
            </StyledMenu>
        </div>
    );
}
