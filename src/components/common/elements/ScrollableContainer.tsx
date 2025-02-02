import React from "react";

interface ScrollableContainerProps {
    children: React.ReactNode;
    breakpointWidth: number;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
    children,
    breakpointWidth,
}) => {
    return (
        <div
            style={{
                overflowX: "auto",
                maxWidth: "100%",
            }}
        >
            <div
                style={{
                    minWidth: breakpointWidth,
                    width: "100%",
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ScrollableContainer;
