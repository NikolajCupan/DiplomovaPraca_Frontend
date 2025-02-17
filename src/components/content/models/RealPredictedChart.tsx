import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import ChartDataManager from "../../common/elements/charts/ChartDataManager.tsx";

import { LineChart } from "@mui/x-charts";

import * as React from "react";

interface RealPredictedChartProps {
    responseBody: Type.RequestResult | null;
    jsonKey: string;
    height: number;
}

function RealPredictedChart(props: RealPredictedChartProps) {
    const [jsonReal, setJsonReal] = React.useState<Type.RequestResult | null>(
        null,
    );
    const [jsonFitted, seTJsonFitted] =
        React.useState<Type.RequestResult | null>(null);
    const frequency = React.useRef<string>("");

    const [real_yChartDataArray, real_setYChartDataArray] = React.useState<
        (number | null)[]
    >([]);
    const [real_yAxisLimits, real_setYAxisLimits] = React.useState<number[]>(
        [],
    );

    const [fitted_yChartDataArray, fitted_setYChartDataArray] = React.useState<
        (number | null)[]
    >([]);
    const [fitted_yAxisLimits, fitted_setYAxisLimits] = React.useState<
        number[]
    >([]);

    const [xChartDataArray, setXChartDataArray] = React.useState<Date[]>([]);
    const [xAxisLimits, setXAxisLimits] = React.useState<Date[]>([]);

    React.useEffect(() => {
        if (!props.responseBody) {
            return;
        }

        const responseBodyData: Record<string, any> = JSON.parse(
            props.responseBody.data,
        );
        if (!(props.jsonKey in responseBodyData)) {
            return;
        }

        frequency.current =
            responseBodyData[Constants.FREQUENCY_TYPE_KEY][
                Constants.OUTPUT_ELEMENT_RESULT_KEY
            ];
        const chartData: Record<string, any> = responseBodyData[props.jsonKey];

        const realArray = Helper.transformToJsonWithKeys(
            chartData,
            Constants.MODEL_REAL_KEY,
            Constants.MODEL_DATE_KEY,
        );
        setJsonReal(realArray);

        const fittedArray = Helper.transformToJsonWithKeys(
            chartData,
            Constants.MODEL_FITTED_KEY,
            Constants.MODEL_DATE_KEY,
        );
        seTJsonFitted(fittedArray);
    }, [props.responseBody]);

    const getChartElement = () => {
        if (real_yChartDataArray.length <= 2 || xChartDataArray.length <= 2) {
            return (
                <div className="inner-container-style">
                    Nedostatok dát pre graf
                </div>
            );
        }

        const actualMin = Math.min(real_yAxisLimits[0], fitted_yAxisLimits[0]);
        const actualMax = Math.max(real_yAxisLimits[1], fitted_yAxisLimits[1]);
        const actualRange = actualMax - actualMin;

        return (
            <>
                <LineChart
                    xAxis={[
                        {
                            data: xChartDataArray,
                            min: xAxisLimits[0],
                            max: xAxisLimits[1],
                            scaleType: "time",
                            valueFormatter: (value) => {
                                return Helper.formatChartValueX(
                                    value,
                                    frequency.current,
                                );
                            },
                        },
                    ]}
                    yAxis={[
                        {
                            min: actualMin - (actualRange / 100) * 2.5,
                            max: actualMax + (actualRange / 100) * 2.5,
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
                            label: "Skutočnosť",
                            data: real_yChartDataArray,
                            curve: "linear",
                            showMark: false,
                            color: "var(--primary-color)",
                        },
                        {
                            label: "Predikcia",
                            data: fitted_yChartDataArray,
                            curve: "linear",
                            showMark: false,
                            color: "var(--secondary-color)",
                        },
                    ]}
                    height={props.height}
                />
            </>
        );
    };

    return (
        <>
            <ChartDataManager
                manageXAxis={false}
                manageSlider={false}
                isXAxisDate={true}
                /* Y axis */
                yAxisArrayKey={"data"}
                yChartDataArray={real_yChartDataArray}
                setYChartDataArray={real_setYChartDataArray}
                yAxisLimits={real_yAxisLimits}
                setYAxisLimits={real_setYAxisLimits}
                /* Y axis end */
                responseBody={jsonReal!}
            />

            <ChartDataManager
                manageXAxis={true}
                manageSlider={false}
                isXAxisDate={true}
                /* Y axis */
                yAxisArrayKey={"data"}
                yChartDataArray={fitted_yChartDataArray}
                setYChartDataArray={fitted_setYChartDataArray}
                yAxisLimits={fitted_yAxisLimits}
                setYAxisLimits={fitted_setYAxisLimits}
                /* Y axis end */
                /* X axis */
                xAxisArrayKey={"date"}
                xChartDataArray={xChartDataArray}
                setXChartDataArray={
                    setXChartDataArray as React.Dispatch<
                        React.SetStateAction<number[] | Date[]>
                    >
                }
                xAxisLimits={xAxisLimits}
                setXAxisLimits={
                    setXAxisLimits as React.Dispatch<
                        React.SetStateAction<number[] | Date[]>
                    >
                }
                /* X axis end */
                responseBody={jsonFitted!}
            />

            {getChartElement()}
        </>
    );
}

export default RealPredictedChart;
