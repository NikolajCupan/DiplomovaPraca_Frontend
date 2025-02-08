import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";

import { LineChart } from "@mui/x-charts/LineChart";

import * as React from "react";
import SliderDoubleInput from "../inputs/SliderDoubleInput.tsx";
import CenteredContainer from "./CenteredContainer.tsx";

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
    const [yAxisArray, setYAxisArray] = React.useState<
        (number | null)[] | null
    >(null);
    const [xAxisArray, setXAxisArray] = React.useState<number[] | null>(null);
    const [xAxisLimits, setXAxisLimits] = React.useState<number[]>([]);

    const usedMinDistance = React.useRef<number | null>(null);

    React.useEffect(() => {
        clearState();
        if (!props.responseBody) {
            return;
        }

        const json: Record<string, any> = JSON.parse(props.responseBody.data);
        if (
            !(props.yAxisArrayKey in json) ||
            (props.xAxisArrayKey && !(props.xAxisArrayKey in json))
        ) {
            return;
        }

        const yAxisInnerJson: Record<string, any> = json[props.yAxisArrayKey];
        const yAxisArray = yAxisInnerJson[Constants.OUTPUT_ELEMENT_RESULT_KEY];
        setYAxisArray(yAxisArray);

        let xAxisArray: number[] = [];
        if (props.xAxisArrayKey) {
            const xAxisInnerJsonY: Record<string, any> =
                json[props.xAxisArrayKey];
            xAxisArray = xAxisInnerJsonY[Constants.OUTPUT_ELEMENT_RESULT_KEY];
        } else {
            xAxisArray = generateXDataArray(yAxisArray);
        }

        setXAxisArray(xAxisArray);
        const [xMin, xMax] = getArrayRange(xAxisArray);
        setXAxisLimits([xMin, xMax]);
    }, [props.responseBody]);

    const clearState = () => {
        setYAxisArray(null);
        setXAxisArray(null);
        setXAxisLimits([]);
    };

    function getArrayRange(
        array: (number | null)[],
    ): [min: number, max: number, range: number] {
        const filteredArray = array.filter((x) => x !== null);

        const min = Math.min(...filteredArray);
        const max = Math.max(...filteredArray);
        const range = max - min;

        return [min, max, range];
    }

    const generateXDataArray = (yDataArray: (number | null)[]): number[] => {
        let xDataArray: number[] = [];
        for (let i = 0; i < yDataArray.length; ++i) {
            xDataArray[i] = i;
        }

        return xDataArray;
    };

    const getChartData = (): [
        yChartDataArray: (number | null)[],
        xChartDataArray: number[],
    ] => {
        let yChartDataArray: (number | null)[] = [];
        let xChartDataArray: number[] = [];

        if (!yAxisArray) {
            return [yChartDataArray, xChartDataArray];
        }

        let startIndex = 0;
        while (yAxisArray[startIndex] === null) {
            ++startIndex;
        }

        let endIndex = yAxisArray.length - 1;
        while (yAxisArray[endIndex] === null) {
            --endIndex;
        }

        if (startIndex <= endIndex) {
            yChartDataArray = yAxisArray.slice(startIndex, endIndex + 1);

            if (xAxisArray) {
                xChartDataArray = xAxisArray.slice(startIndex, endIndex + 1);
            } else {
                xChartDataArray = generateXDataArray(yChartDataArray);
            }
        }

        return [yChartDataArray, xChartDataArray];
    };

    const getMinDistance = () => {
        if (usedMinDistance.current !== null) {
            return usedMinDistance.current;
        }

        let minDistance = 1;

        if (props.minDistance !== undefined) {
            const range =
                Math.ceil(xAxisLimits[1]) - Math.floor(xAxisLimits[0]);

            if (range > props.minDistance) {
                minDistance = props.minDistance;
            }
        }

        usedMinDistance.current = minDistance;
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
                    minValue={xAxisLimits[0]}
                    maxValue={xAxisLimits[1]}
                    minDistance={getMinDistance()}
                />
            </CenteredContainer>
        );
    };

    const getChartElement = () => {
        const [yChartDataArray, xChartDataArray] = getChartData();
        if (yChartDataArray.length <= 2) {
            return (
                <div className="inner-container-style">
                    Nedostatok dát pre graf{" "}
                    <span style={{ fontWeight: "bold" }}>{props.label}</span>
                </div>
            );
        }

        const [yMin, yMax, yRange] = getArrayRange(yChartDataArray);

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
                            min: yMin - (yRange / 100) * 2.5,
                            max: yMax + (yRange / 100) * 2.5,
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

    return <>{getChartElement()}</>;
}

export default LineChartWrapper;
