import * as React from "react";

interface ScrollableContainerProps {
    children: React.ReactNode;
    breakpointWidth: number;

    customClass?: string;
    customStyle?: React.CSSProperties;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
    children,
    breakpointWidth,
    customClass,
    customStyle,
}) => {
    return (
        <div
            className={customClass}
            style={{
                ...customStyle,
                overflowX: "auto",
                overflowY: "hidden",
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
