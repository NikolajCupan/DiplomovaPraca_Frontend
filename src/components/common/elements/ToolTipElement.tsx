import { Tooltip } from "@mui/material";

import * as React from "react";

interface ToolTipElementProps {
    icon: React.ReactNode;
    title?: string;
    link?: string;
}

function ToolTipElement(props: ToolTipElementProps) {
    return (
        <Tooltip title={props.title !== undefined ? props.title : ""} arrow>
            <a
                {...(props.link !== undefined && {
                    href: props.link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                })}
            >
                {props.icon}
            </a>
        </Tooltip>
    );
}

export default ToolTipElement;
