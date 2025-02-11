import * as Constants from "../../../../helpers/Constants.tsx";
import * as Helper from "../../../../helpers/Helper.tsx";
import * as Type from "../../../../helpers/Types.tsx";

import * as React from "react";

interface ChartDataManagerProps {
    // Y axis
    yAxisArrayKey: string;

    yChartDataArray: (number | null)[];
    setYChartDataArray: React.Dispatch<React.SetStateAction<(number | null)[]>>;

    yAxisLimits: number[];
    setYAxisLimits: React.Dispatch<React.SetStateAction<number[]>>;
    // Y axis end

    // X axis
    manageXAxis: boolean;
    isXAxisDate: boolean;

    xAxisStartValue?: number;

    xAxisArrayKey?: string;

    xChartDataArray?: number[] | Date[];
    setXChartDataArray?: React.Dispatch<
        React.SetStateAction<number[] | Date[]>
    >;

    xAxisLimits?: number[] | Date[];
    setXAxisLimits?: React.Dispatch<React.SetStateAction<number[] | Date[]>>;
    // X axis end

    // Slider
    manageSlider: boolean;

    minSliderDistance?: number;
    usedMinSliderDistance?: number | null;
    setUsedMinSliderDistance?: React.Dispatch<
        React.SetStateAction<number | null>
    >;
    // Slider end

    responseBody: Type.RequestResult;
}

function ChartDataManager(props: ChartDataManagerProps) {
    const [yAxisArray, setYAxisArray] = React.useState<
        (number | null)[] | null
    >(null);
    const [xAxisArray, setXAxisArray] = React.useState<
        number[] | Date[] | null
    >(null);
    const [bothAxes, setBothAxes] = React.useState({ yAxisArray, xAxisArray });

    React.useEffect(() => {
        generateChartData();
    }, [bothAxes]);

    React.useEffect(() => {
        if (!props.manageXAxis) {
            generateChartData();
        }
    }, [yAxisArray]);

    React.useEffect(() => {
        setBothAxes((previousState: any) => {
            return yAxisArray !== previousState.yAxisArray &&
                xAxisArray !== previousState.xAxisArray
                ? { yAxisArray, xAxisArray }
                : previousState;
        });
    }, [yAxisArray, xAxisArray]);

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
        const yAxisInnerJsonArray =
            yAxisInnerJson[Constants.OUTPUT_ELEMENT_RESULT_KEY];
        setYAxisArray(yAxisInnerJsonArray);

        if (!props.manageXAxis) {
            return;
        }

        if (props.isXAxisDate && props.xAxisArrayKey) {
            let xAxisInnerJsonArray: string[] = [];
            const xAxisInnerJson: Record<string, any> =
                json[props.xAxisArrayKey];
            xAxisInnerJsonArray =
                xAxisInnerJson[Constants.OUTPUT_ELEMENT_RESULT_KEY];

            const datesArray: Date[] = xAxisInnerJsonArray.map((element) => {
                return Helper.stringToDate(element);
            });
            setXAxisArray(datesArray);
        } else {
            let xAxisInnerJsonArray: number[] = [];

            if (props.xAxisArrayKey) {
                const xAxisInnerJson: Record<string, any> =
                    json[props.xAxisArrayKey];
                xAxisInnerJsonArray =
                    xAxisInnerJson[Constants.OUTPUT_ELEMENT_RESULT_KEY];
            } else {
                xAxisInnerJsonArray = generateXDataArray(yAxisInnerJsonArray);
            }

            setXAxisArray(xAxisInnerJsonArray);
        }
    }, [props.responseBody]);

    const clearState = () => {
        // Y axis
        props.setYChartDataArray([]);
        props.setYAxisLimits([]);
        setYAxisArray(null);
        // Y axis end

        // X axis
        if (props.manageXAxis) {
            props.setXChartDataArray!([]);
            props.setXAxisLimits!([]);
            setXAxisArray(null);
        }
        // X axis end
    };

    const generateXDataArray = (yDataArray: (number | null)[]): number[] => {
        let xDataArray: number[] = [];
        let currentValue =
            props.xAxisStartValue === undefined ? 0 : props.xAxisStartValue;

        for (let i = 0; i < yDataArray.length; ++i) {
            if (yDataArray[i] !== null) {
                xDataArray[i] = currentValue;
            }

            ++currentValue;
        }

        return xDataArray;
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

    function getDateArrayRange(
        array: Date[],
    ): [min: Date, max: Date, range: Date] {
        const filteredArray = array.filter((x) => x !== null);

        const min = filteredArray[0];
        const max = filteredArray[filteredArray.length - 1];

        return [min, max, max];
    }

    const generateChartData = () => {
        if (!yAxisArray || (props.manageXAxis && !yAxisArray)) {
            clearStateParent();
            return;
        }

        let yChartDataArray: (number | null)[] = [];
        let xChartDataArray: number[] | Date[] = [];

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

        const [yMin, yMax, yRange] = getArrayRange(yChartDataArray);
        props.setYChartDataArray(yChartDataArray);
        props.setYAxisLimits([yMin, yMax, yRange]);

        if (props.manageXAxis) {
            props.setXChartDataArray!(xChartDataArray);

            if (props.isXAxisDate) {
                const [xMin, xMax, xRange] = getDateArrayRange(
                    xChartDataArray as Date[],
                );
                props.setXAxisLimits!([xMin, xMax, xRange]);
            } else {
                const [xMin, xMax, xRange] = getArrayRange(
                    xChartDataArray as (number | null)[],
                );
                props.setXAxisLimits!([xMin, xMax, xRange]);
            }
        }

        // Slider
        if (props.manageSlider) {
            let minSliderDistance = 1;

            const [xMin, xMax] = getArrayRange(
                xChartDataArray as (number | null)[],
            );
            if (props.minSliderDistance !== undefined) {
                const range = Math.ceil(xMax) - Math.floor(xMin);

                if (range > props.minSliderDistance) {
                    minSliderDistance = props.minSliderDistance;
                }
            }

            props.setUsedMinSliderDistance!(minSliderDistance);
        }
        // Slider end
    };

    const clearStateParent = () => {
        props.setYChartDataArray([]);
        props.setYAxisLimits([]);

        if (props.manageXAxis) {
            props.setXChartDataArray!([]);
            props.setXAxisLimits!([]);
        }
    };

    return <></>;
}

export default ChartDataManager;
