import * as Utility from "../../helpers/UtilityProvider.tsx";
import HelperElement from "./HelperElement.tsx";
import "./LayoutStyles.css";
import MenuData from "./Menus/MenuData.tsx";
import MenuModels from "./Menus/MenuModels.tsx";
import MenuTests from "./Menus/MenuTests.tsx";
import MenuTransformations from "./Menus/MenuTransformations.tsx";

import MenuIcon from "@mui/icons-material/Menu";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import * as React from "react";

interface InternalComponentProps {
    component: React.ReactNode;
}

function ResponsiveAppBar(props: InternalComponentProps) {
    const { closeNotification } = Utility.useUtility();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null,
    );

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        closeNotification();
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleResize = () => {
        const header = document.getElementById("header");
        const headerContainer = document.getElementById("header-container");
        headerContainer!.setAttribute(
            "style",
            `height: ${header!.offsetHeight}px`,
        );
    };

    React.useEffect(() => {
        handleResize();

        window.addEventListener("resize", handleResize);
        window.addEventListener("resize", handleCloseNavMenu);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("resize", handleCloseNavMenu);
        };
    }, []);

    return (
        <>
            <div id="header-container">
                <AppBar id="header">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: { xs: "flex", md: "none" },
                                }}
                            >
                                <IconButton
                                    size="large"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{
                                        display: {
                                            xs: "block",
                                            md: "none",
                                        },
                                    }}
                                    slotProps={{
                                        paper: {
                                            sx: {
                                                borderRadius:
                                                    "var(--default-border-radius)",
                                            },
                                        },
                                    }}
                                    className="mini-menu-items"
                                >
                                    <div className="custom-mini-menu-item">
                                        <MenuData />
                                    </div>
                                    <div className="custom-mini-menu-item">
                                        <MenuTests />
                                    </div>
                                    <div className="custom-mini-menu-item">
                                        <MenuTransformations />
                                    </div>
                                    <div className="custom-mini-menu-item">
                                        <MenuModels />
                                    </div>
                                </Menu>
                            </Box>

                            <SsidChartIcon
                                sx={{
                                    display: { xs: "flex", md: "none" },
                                    mr: 1,
                                }}
                                className="logo-small"
                            />
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                sx={{
                                    mr: 2,
                                    display: { xs: "flex", md: "none" },
                                    flexGrow: 1,
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                <span className="logo-small-text">
                                    Diplomová práca
                                </span>
                            </Typography>

                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: { xs: "none", md: "flex" },
                                }}
                            >
                                <div className="custom-menu-item">
                                    <MenuData />
                                </div>
                                <div className="custom-menu-item">
                                    <MenuTests />
                                </div>
                                <div className="custom-menu-item">
                                    <MenuTransformations />
                                </div>
                                <div className="custom-menu-item">
                                    <MenuModels />
                                </div>
                            </Box>

                            <SsidChartIcon
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    mr: 1,
                                }}
                            />
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                    mr: 2,
                                    display: { xs: "none", md: "flex" },
                                    fontWeight: 700,
                                    letterSpacing: ".3rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                    fontFamily: "inherit",
                                }}
                            >
                                Diplomová práca
                            </Typography>
                        </Toolbar>
                    </Container>
                </AppBar>
            </div>

            <div id="content">{props.component}</div>
            <HelperElement />
        </>
    );
}

export default ResponsiveAppBar;
