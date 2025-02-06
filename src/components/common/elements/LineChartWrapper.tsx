import * as Constants from "../../../helpers/Constants.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";

import { LineChart } from "@mui/x-charts/LineChart";

import * as React from "react";

interface LineChartProps {
    label: string;
    yAxisArrayKey: string;
    xAxisArrayKey?: string;
    height: number;
    color?: string;

    responseBody: Type.RequestResult | null;
}

function LineChartWrapper(props: LineChartProps) {
    const [title, setTitle] = React.useState<string | null>(null);
    const [yAxisArray, setYAxisArray] = React.useState<
        (number | null)[] | null
    >(null);
    const [xAxisArray, setXAxisArray] = React.useState<number[] | null>(null);

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
        setTitle(yAxisInnerJson[Constants.OUTPUT_ELEMENT_TITLE_KEY]);
        setYAxisArray(yAxisInnerJson[Constants.OUTPUT_ELEMENT_RESULT_KEY]);

        if (props.xAxisArrayKey) {
            const xAxisInnerJsonY: Record<string, any> =
                json[props.xAxisArrayKey];
            setXAxisArray(xAxisInnerJsonY[Constants.OUTPUT_ELEMENT_RESULT_KEY]);
        }
    }, [props.responseBody]);

    const clearState = () => {
        setTitle(null);
        setYAxisArray(null);
        setXAxisArray(null);
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
        yDataArray: (number | null)[],
        xDataArray: number[],
    ] => {
        let yDataArray: (number | null)[] = [];
        let xDataArray: number[] = [];

        if (!yAxisArray) {
            return [yDataArray, xDataArray];
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
            yDataArray = yAxisArray.slice(startIndex, endIndex + 1);

            if (xAxisArray) {
                xDataArray = xAxisArray.slice(startIndex, endIndex + 1);
            } else {
                xDataArray = generateXDataArray(yDataArray);
            }
        }

        return [yDataArray, xDataArray];
    };

    const getChartElement = () => {
        const [yDataArray, xDataArray] = getChartData();
        if (yDataArray.length <= 2) {
            return (
                <div className="inner-container-style">
                    Nedostatok dát pre graf
                </div>
            );
        }

        const [xMin, xMax] = getArrayRange(xDataArray);
        const [yMin, yMax, yRange] = getArrayRange(yDataArray);

        return (
            <>
                <LineChart
                    xAxis={[
                        {
                            data: xDataArray,
                            min: xMin,
                            max: xMax,
                        },
                    ]}
                    yAxis={[
                        {
                            min: yMin - (yRange / 100) * 2.5,
                            max: yMax + (yRange / 100) * 2.5,
                        },
                    ]}
                    series={[
                        {
                            label: props.label,
                            data: yDataArray,
                            curve: "linear",
                            showMark: false,
                            ...(props.color
                                ? { color: props.color }
                                : { color: "var(--primary-color)" }),
                        },
                    ]}
                    height={props.height}
                />
            </>
        );
    };

    const getDisplayElement = () => {
        if (yAxisArray && title) {
            return getChartElement();
        } else {
            return <div></div>;
        }
    };

    return <div>{getDisplayElement()}</div>;
}

export default LineChartWrapper;
