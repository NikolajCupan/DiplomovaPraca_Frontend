import FindInPageIcon from "@mui/icons-material/FindInPage";
import InfoIcon from "@mui/icons-material/Info";
import ToolTipElement from "../../common/elements/ToolTipElement.tsx";

import * as React from "react";

interface HeaderProps {
    text: string;
    breakpointWidth: number;
    link: string | [string, string][];
    excludeInfoTooltip?: boolean;
    fontSizePx?: number;
}

function Header(props: HeaderProps) {
    const [isSmall, setIsSmall] = React.useState(false);

    React.useEffect(() => {
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const iconStyle = {
        ...(isSmall ? {} : { marginTop: "5px" }),
        height: "30px",
        width: "30px",
    };

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
                    ...(props.fontSizePx && {
                        fontSize: props.fontSizePx + "px",
                    }),
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
                {(props.excludeInfoTooltip === undefined ||
                    !props.excludeInfoTooltip) && (
                    <ToolTipElement
                        title={
                            "Pre nepoužité parametre bude nastavená predvolená hodnota. Viac informácií nájdete v oficiálnej dokumentácii."
                        }
                        icon={<InfoIcon style={iconStyle} color="primary" />}
                    />
                )}

                {Array.isArray(props.link) ? (
                    props.link.map((item, key) => (
                        <React.Fragment key={key}>
                            <ToolTipElement
                                title={"Oficiálna dokumentácia " + item[1]}
                                link={item[0]}
                                icon={
                                    <FindInPageIcon
                                        style={iconStyle}
                                        color="primary"
                                    />
                                }
                            />
                        </React.Fragment>
                    ))
                ) : (
                    <ToolTipElement
                        title={"Oficiálna dokumentácia"}
                        link={props.link}
                        icon={
                            <FindInPageIcon style={iconStyle} color="primary" />
                        }
                    />
                )}
            </div>
        </div>
    );
}

export default Header;
