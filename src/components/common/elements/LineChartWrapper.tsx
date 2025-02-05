import * as Constants from "../../../helpers/Constants.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";

import { LineChart } from "@mui/x-charts/LineChart";

import * as React from "react";

interface LineChartProps {
    label: string;
    arrayKey: string;
    height: number;
    color?: string;

    responseBody: Type.RequestResult | null;
}

function LineChartWrapper(props: LineChartProps) {
    const [title, setTitle] = React.useState<string | null>(null);
    const [array, setArray] = React.useState<(number | null)[] | null>(null);

    React.useEffect(() => {
        if (!props.responseBody) {
            setTitle(null);
            setArray(null);
            return;
        }

        const json: Record<string, any> = JSON.parse(props.responseBody.data);
        if (!(props.arrayKey in json)) {
            setTitle(null);
            setArray(null);
            return;
        }

        const innerJson: Record<string, any> = json[props.arrayKey];
        setTitle(innerJson[Constants.OUTPUT_ELEMENT_TITLE_KEY]);
        setArray(innerJson[Constants.OUTPUT_ELEMENT_RESULT_KEY]);
    }, [props.responseBody]);

    const getChartData = () => {
        if (!array) {
            return [];
        }

        let startIndex = 0;
        while (array[startIndex] === null) {
            ++startIndex;
        }

        let endIndex = array.length - 1;
        while (array[endIndex] === null) {
            --endIndex;
        }

        if (startIndex <= endIndex) {
            return array.slice(startIndex, endIndex + 1);
        }

        return [];
    };

    const getChartLabelData = (chartArray: (number | null)[]) => {
        let chartLabelData: number[] = [];
        for (let i = 0; i < chartArray.length; ++i) {
            chartLabelData[i] = i;
        }

        return chartLabelData;
    };

    const getChartElement = () => {
        const chartArray = getChartData();
        if (chartArray.length <= 2) {
            return <div>no data</div>;
        }

        const chartLabelData = getChartLabelData(chartArray);

        return (
            <>
                <LineChart
                    xAxis={[
                        {
                            data: chartLabelData,
                            min: chartLabelData[0],
                            max: chartLabelData[chartLabelData.length - 1],
                        },
                    ]}
                    series={[
                        {
                            label: props.label,
                            data: chartArray,
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
        if (array && title) {
            return getChartElement();
        } else {
            return <div></div>;
        }
    };

    return <div>{getDisplayElement()}</div>;
}

export default LineChartWrapper;
