import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";

import { LineChart } from "@mui/x-charts";
import * as React from "react";
import ChartDataManager from "../../common/elements/charts/ChartDataManager.tsx";

interface ComparisonChartElementProps {
    responseBody: Type.RequestResult | null;
    jsonKey: string;
}

function ComparisonChartElement(props: ComparisonChartElementProps) {
    const [jsonReal, setJsonReal] = React.useState<Type.RequestResult | null>(
        null,
    );
    const [jsonFitted, seTJsonFitted] =
        React.useState<Type.RequestResult | null>(null);

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

        const chartData: Record<string, any> = responseBodyData[props.jsonKey];

        const jsonReal = Helper.transformToJsonWithKeys(
            chartData,
            Constants.MODEL_REAL_KEY,
            Constants.MODEL_DATE_KEY,
        );
        setJsonReal(jsonReal);

        const jsonFitted = Helper.transformToJsonWithKeys(
            chartData,
            Constants.MODEL_FITTED_KEY,
            Constants.MODEL_DATE_KEY,
        );
        seTJsonFitted(jsonFitted);
    }, [props.responseBody]);

    const getChartElement = () => {
        if (real_yChartDataArray.length <= 2 || xChartDataArray.length <= 2) {
            return (
                <div className="inner-container-style">
                    Nedostatok dát pre graf
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
                    series={[
                        {
                            data: real_yChartDataArray,
                            curve: "linear",
                            showMark: false,
                            color: "pink",
                        },
                        {
                            data: fitted_yChartDataArray,
                            curve: "linear",
                            showMark: false,
                            color: "green",
                        },
                    ]}
                    height={500}
                />
            </>
        );
    };

    return (
        <>
            <ChartDataManager
                manageXAxis={true}
                manageSlider={false}
                isXAxisDate={true}
                /* Y axis */
                yAxisArrayKey={"data"}
                yChartDataArray={real_yChartDataArray}
                setYChartDataArray={real_setYChartDataArray}
                yAxisLimits={real_yAxisLimits}
                setYAxisLimits={real_setYAxisLimits}
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
                responseBody={jsonReal!}
            />

            <ChartDataManager
                manageXAxis={false}
                manageSlider={false}
                isXAxisDate={false}
                /* Y axis */
                yAxisArrayKey={"data"}
                yChartDataArray={fitted_yChartDataArray}
                setYChartDataArray={fitted_setYChartDataArray}
                yAxisLimits={fitted_yAxisLimits}
                setYAxisLimits={fitted_setYAxisLimits}
                /* Y axis end */
                responseBody={jsonFitted!}
            />

            {getChartElement()}
        </>
    );
}

export default ComparisonChartElement;
