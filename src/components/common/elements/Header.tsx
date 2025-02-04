import FindInPageIcon from "@mui/icons-material/FindInPage";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip } from "@mui/material";

import * as React from "react";

interface HeaderProps {
    text: string;
    breakpointWidth: number;
    link: string;
}

function Header(props: HeaderProps) {
    const [isSmall, setIsSmall] = React.useState(false);

    React.useEffect(() => {
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleResize = () => {
        const header = document.getElementById("header-container");

        if (header!.offsetWidth < props.breakpointWidth) {
            setIsSmall(true);
        } else {
            setIsSmall(false);
        }
    };

    return (
        <div
            id="header-container"
            style={{
                display: isSmall ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <h1
                style={{
                    marginTop: "20px",
                    marginRight: isSmall ? "0" : "10px",
                    marginBottom: isSmall ? "5px" : "20px",
                    textAlign: "center",
                }}
            >
                {props.text}
            </h1>
            <div
                style={{
                    ...(isSmall && {
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "10px",
                    }),
                }}
            >
                <Tooltip
                    title="Pre nepoužité parametre bude nastavená predvolená hodnota. Viac informácií nájdete v oficiálnej dokumentácii."
                    arrow
                >
                    <a>
                        <InfoIcon
                            style={{
                                ...(!isSmall && { marginTop: "5px" }),
                                height: "30px",
                                width: "30px",
                            }}
                            color="primary"
                        />
                    </a>
                </Tooltip>
                <Tooltip title="Oficiálna dokumentácia" arrow>
                    <a
                        href={props.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FindInPageIcon
                            style={{
                                ...(!isSmall && { marginTop: "5px" }),
                                height: "30px",
                                width: "30px",
                            }}
                            color="primary"
                        />
                    </a>
                </Tooltip>
            </div>
        </div>
    );
}

export default Header;
