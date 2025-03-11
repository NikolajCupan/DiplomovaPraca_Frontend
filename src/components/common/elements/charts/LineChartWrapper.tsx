import * as Constants from "../../../../helpers/Constants.tsx";
import * as Helper from "../../../../helpers/Helper.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import "../../../../index.css";
import SliderDoubleInput from "../../inputs/SliderDoubleInput.tsx";
import CenteredContainer from "../CenteredContainer.tsx";
import ChartDataManager from "./ChartDataManager.tsx";

import { LineChart } from "@mui/x-charts";

import * as React from "react";

interface LineChartProps {
    label: string;

    yAxisArrayKey: string;
    xAxisArrayKey?: string;
    isXAxisDate?: boolean;
    frequency?: string;

    height: number;
    color?: string;
    skipAnimation?: boolean;

    useSlider?: boolean;
    minSliderDistance?: number;

    responseBody: Type.RequestResult;
}

function LineChartWrapper(props: LineChartProps) {
    if (
        props.isXAxisDate !== undefined &&
        props.isXAxisDate &&
        props.useSlider !== undefined &&
        props.useSlider
    ) {
        return <div>Cannot use slider with date X axis</div>;
    }

    const [yChartDataArray, setYChartDataArray] = React.useState<
        (number | null)[]
    >([]);
    const [yAxisLimits, setYAxisLimits] = React.useState<number[]>([]);

    const [xChartDataArray, setXChartDataArray] = React.useState<
        number[] | Date[]
    >([]);
    const [xAxisLimits, setXAxisLimits] = React.useState<number[] | Date[]>([]);

    const [sliderUsedMinDistance, setSliderUsedMinDistance] = React.useState<
        number | null
    >(null);

    const getSliderElement = () => {
        if (
            props.useSlider === undefined ||
            !props.useSlider ||
            !sliderUsedMinDistance
        ) {
            return;
        }

        return (
            <CenteredContainer widthPercent={80}>
                <SliderDoubleInput
                    value={xAxisLimits as number[]}
                    setValue={
                        setXAxisLimits as React.Dispatch<
                            React.SetStateAction<number[]>
                        >
                    }
                    permanentMinValue={xAxisLimits[0] as number}
                    permanentMaxValue={xAxisLimits[1] as number}
                    minDistance={sliderUsedMinDistance}
                />
            </CenteredContainer>
        );
    };

    const getChartElement = () => {
        if (yChartDataArray.length <= 2 || xChartDataArray.length <= 2) {
            return (
                <div className="inner-container-style">
                    Nedostatok dát pre graf{" "}
                    <span style={{ fontWeight: "bold" }}>{props.label}</span>
                </div>
            );
        }

        return (
            <>
                <LineChart
                    xAxis={[
                        {
                            data: xChartDataArray,
                            min: xAxisLimits[0],
                            max: xAxisLimits[1],
                            ...(props.isXAxisDate && {
                                scaleType: "time",
                                valueFormatter: (value) => {
                                    return Helper.formatChartValueX(
                                        value,
                                        props.frequency!,
                                    );
                                },
                            }),
                        },
                    ]}
                    yAxis={[
                        {
                            min: yAxisLimits[0] - (yAxisLimits[2] / 100) * 2.5,
                            max: yAxisLimits[1] + (yAxisLimits[2] / 100) * 2.5,
                            valueFormatter: (value) => {
                                if (value.toString().indexOf("e") > -1) {
                                    return value;
                                }

                                const numberValue = Number(value);
                                if (
                                    Helper.getDecimalDigitsCount(numberValue) >=
                                        5 ||
                                    Helper.getWholeDigitsCount(numberValue) >= 5
                                ) {
                                    return numberValue.toExponential(1);
                                }

                                return value;
                            },
                        },
                    ]}
                    series={[
                        {
                            label: props.label,
                            data: yChartDataArray,
                            curve: "linear",
                            showMark: false,
                            ...(props.color
                                ? { color: props.color }
                                : { color: "var(--primary-color)" }),
                        },
                    ]}
                    height={props.height}
                    {...(yChartDataArray.length >
                        Constants.CHART_MAX_DATA_HOVER && {
                        sx: { pointerEvents: "none" },
                        skipAnimation: true,
                    })}
                    {...(props.skipAnimation !== undefined &&
                        props.skipAnimation && {
                            skipAnimation: true,
                        })}
                />

                {getSliderElement()}
            </>
        );
    };

    return (
        <>
            <ChartDataManager
                manageXAxis={true}
                manageSlider={true}
                isXAxisDate={
                    props.isXAxisDate === undefined ? false : props.isXAxisDate
                }
                /* Y axis */
                yAxisArrayKey={props.yAxisArrayKey}
                yChartDataArray={yChartDataArray}
                setYChartDataArray={setYChartDataArray}
                yAxisLimits={yAxisLimits}
                setYAxisLimits={setYAxisLimits}
                /* Y axis end */
                /* X axis */
                xAxisArrayKey={props.xAxisArrayKey}
                xChartDataArray={xChartDataArray}
                setXChartDataArray={setXChartDataArray}
                xAxisLimits={xAxisLimits}
                setXAxisLimits={setXAxisLimits}
                /* X axis end */
                minSliderDistance={props.minSliderDistance}
                usedMinSliderDistance={sliderUsedMinDistance}
                setUsedMinSliderDistance={setSliderUsedMinDistance}
                responseBody={props.responseBody}
            />

            {getChartElement()}
        </>
    );
}

export default LineChartWrapper;
