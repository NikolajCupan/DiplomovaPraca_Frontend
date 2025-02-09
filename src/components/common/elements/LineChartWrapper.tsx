import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import SliderDoubleInput from "../inputs/SliderDoubleInput.tsx";
import CenteredContainer from "./CenteredContainer.tsx";

import { LineChart } from "@mui/x-charts/LineChart";

import * as React from "react";
import ChartDataManager from "./ChartDataManager.tsx";

interface LineChartProps {
    label: string;

    yAxisArrayKey: string;
    xAxisArrayKey?: string;

    height: number;
    color?: string;

    useSlider?: boolean;
    minDistance?: number;

    responseBody: Type.RequestResult;
}

function LineChartWrapper(props: LineChartProps) {
    const [yChartDataArray, setYChartDataArray] = React.useState<
        (number | null)[]
    >([]);
    const [yAxisLimits, setYAxisLimits] = React.useState<number[]>([]);

    const [xChartDataArray, setXChartDataArray] = React.useState<number[]>([]);
    const [xAxisLimits, setXAxisLimits] = React.useState<number[]>([]);

    const usedSliderMinDistance = React.useRef<number | null>(null);

    const getSliderMinDistance = () => {
        if (usedSliderMinDistance.current !== null) {
            return usedSliderMinDistance.current;
        }

        let minDistance = 1;

        if (props.minDistance !== undefined) {
            const range =
                Math.ceil(xAxisLimits[1]) - Math.floor(xAxisLimits[0]);

            if (range > props.minDistance) {
                minDistance = props.minDistance;
            }
        }

        usedSliderMinDistance.current = minDistance;
        return minDistance;
    };

    const getSliderElement = () => {
        if (props.useSlider === undefined || !props.useSlider) {
            return;
        }

        return (
            <CenteredContainer widthPercent={80}>
                <SliderDoubleInput
                    value={xAxisLimits}
                    setValue={setXAxisLimits}
                    permanentMinValue={xAxisLimits[0]}
                    permanentMaxValue={xAxisLimits[1]}
                    minDistance={getSliderMinDistance()}
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
                                    5
                                ) {
                                    return numberValue.toExponential(0);
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
                />

                {getSliderElement()}
            </>
        );
    };

    return (
        <>
            <ChartDataManager
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
                responseBody={props.responseBody}
            />

            {getChartElement()}
        </>
    );
}

export default LineChartWrapper;
