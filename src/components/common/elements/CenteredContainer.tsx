import * as React from "react";

interface CenteredContainerProps {
    children: React.ReactNode;
    widthPercent: number;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({
    children,
    widthPercent,
}) => {
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ width: widthPercent + "%" }}>{children}</div>
        </div>
    );
};

export default CenteredContainer;
