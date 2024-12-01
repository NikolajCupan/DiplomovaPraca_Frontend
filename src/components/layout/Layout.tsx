import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect } from "react";
import "./LayoutStyles.css";
import MenuData from "./Menus/MenuData";
import MenuModels from "./Menus/MenuModels";
import MenuTests from "./Menus/MenuTests";
import MenuTransformations from "./Menus/MenuTransformations";

interface InternalComponentProps {
    component: React.ReactNode;
}

function ResponsiveAppBar(props: InternalComponentProps) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null,
    );

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    useEffect(() => {
        window.addEventListener("resize", handleCloseNavMenu);
    });

    return (
        <>
            <AppBar position="static">
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
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
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
                            </Menu>
                        </Box>

                        <AdbIcon
                            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
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
                            LOGO
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

                        <AdbIcon
                            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
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
                            LOGO
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>

            <div id="content">{props.component}</div>
        </>
    );
}

export default ResponsiveAppBar;
