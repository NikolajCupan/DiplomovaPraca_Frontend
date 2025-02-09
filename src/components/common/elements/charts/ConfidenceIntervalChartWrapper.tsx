import * as Type from "../../../../helpers/Types.tsx";
import "../../../../index.css";
import SliderDoubleInput from "../../inputs/SliderDoubleInput.tsx";
import CenteredContainer from "../CenteredContainer.tsx";
import ChartDataManager from "./ChartDataManager.tsx";

import {
    ChartsLegend,
    ChartsXAxis,
    ChartsYAxis,
    ResponsiveChartContainer,
} from "@mui/x-charts";
import { BarPlot } from "@mui/x-charts/BarChart";
import { LinePlot } from "@mui/x-charts/LineChart";

import * as React from "react";

interface ConfidenceIntervalChartWrapperProps {
    label: string;

    yAxisArrayKey: string;
    xAxisArrayKey?: string;

    confidenceIntervalUpperBoundKey: string;
    confidenceIntervalLowerBoundKey: string;

    height: number;

    useSlider?: boolean;
    minSliderDistance?: number;

    responseBody: Type.RequestResult;
}

function ConfidenceIntervalChartWrapper(
    props: ConfidenceIntervalChartWrapperProps,
) {
    const [bar_yChartDataArray, bar_setYChartDataArray] = React.useState<
        (number | null)[]
    >([]);
    const [bar_yAxisLimits, bar_setYAxisLimits] = React.useState<number[]>([]);

    const [upperCI_yChartDataArray, upperCI_setYChartDataArray] =
        React.useState<(number | null)[]>([]);
    const [upperCI_yAxisLimits, upperCI_setYAxisLimits] = React.useState<
        number[]
    >([]);

    const [lowerCI_yChartDataArray, lowerCI_setYChartDataArray] =
        React.useState<(number | null)[]>([]);
    const [lowerCI_yAxisLimits, lowerCI_setYAxisLimits] = React.useState<
        number[]
    >([]);

    const [xChartDataArray, setXChartDataArray] = React.useState<number[]>([]);
    const [xAxisLimits, setXAxisLimits] = React.useState<number[]>([]);

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
                    value={xAxisLimits}
                    setValue={setXAxisLimits}
                    permanentMinValue={xAxisLimits[0]}
                    permanentMaxValue={xAxisLimits[1]}
                    minDistance={sliderUsedMinDistance}
                />
            </CenteredContainer>
        );
    };

    const getChartElement = () => {
        if (bar_yChartDataArray.length <= 2 || xChartDataArray.length <= 2) {
            return (
                <div className="inner-container-style">
                    Nedostatok dát pre graf{" "}
                    <span style={{ fontWeight: "bold" }}>{props.label}</span>
                </div>
            );
        }

        return (
            <>
                <ResponsiveChartContainer
                    xAxis={[
                        {
                            data: xChartDataArray,
                            min: xAxisLimits[0],
                            max: xAxisLimits[1],
                            scaleType: "band",
                        },
                    ]}
                    series={[
                        {
                            label: props.label,
                            type: "bar",
                            data: bar_yChartDataArray,
                            color: "var(--primary-color)",
                        },
                        {
                            type: "line",
                            data: upperCI_yChartDataArray,
                            color: "var(--secondary-color)",
                        },
                        {
                            type: "line",
                            data: lowerCI_yChartDataArray,
                            color: "var(--secondary-color)",
                        },
                    ]}
                    height={500}
                >
                    <ChartsLegend />
                    <ChartsXAxis />
                    <ChartsYAxis />
                    <BarPlot />
                    <LinePlot />
                </ResponsiveChartContainer>

                {getSliderElement()}
            </>
        );
    };

    return (
        <>
            <ChartDataManager
                manageXAxis={true}
                manageSlider={true}
                /* Y axis */
                yAxisArrayKey={props.yAxisArrayKey}
                yChartDataArray={bar_yChartDataArray}
                setYChartDataArray={bar_setYChartDataArray}
                yAxisLimits={bar_yAxisLimits}
                setYAxisLimits={bar_setYAxisLimits}
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

            <ChartDataManager
                manageXAxis={false}
                manageSlider={false}
                /* Y axis */
                yAxisArrayKey={props.confidenceIntervalLowerBoundKey}
                yChartDataArray={lowerCI_yChartDataArray}
                setYChartDataArray={lowerCI_setYChartDataArray}
                yAxisLimits={lowerCI_yAxisLimits}
                setYAxisLimits={lowerCI_setYAxisLimits}
                /* Y axis end */
                responseBody={props.responseBody}
            />

            <ChartDataManager
                manageXAxis={false}
                manageSlider={false}
                /* Y axis */
                yAxisArrayKey={props.confidenceIntervalUpperBoundKey}
                yChartDataArray={upperCI_yChartDataArray}
                setYChartDataArray={upperCI_setYChartDataArray}
                yAxisLimits={upperCI_yAxisLimits}
                setYAxisLimits={upperCI_setYAxisLimits}
                /* Y axis end */
                responseBody={props.responseBody}
            />

            {getChartElement()}
        </>
    );
}

export default ConfidenceIntervalChartWrapper;
