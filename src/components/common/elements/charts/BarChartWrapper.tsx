import * as Helper from "../../../../helpers/Helper.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import SliderDoubleInput from "../../inputs/SliderDoubleInput.tsx";
import CenteredContainer from "../CenteredContainer.tsx";
import ChartDataManager from "./ChartDataManager.tsx";

import { BarChart } from "@mui/x-charts/BarChart";
import * as React from "react";

interface BarChartWrapperProps {
    label: string;

    yAxisArrayKey: string;
    xAxisArrayKey?: string;

    height: number;
    color?: string;

    useSlider?: boolean;
    minSliderDistance?: number;

    responseBody: Type.RequestResult;
}

function BarChartWrapper(props: BarChartWrapperProps) {
    const [yChartDataArray, setYChartDataArray] = React.useState<
        (number | null)[]
    >([]);
    const [yAxisLimits, setYAxisLimits] = React.useState<number[]>([]);

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
        if (yChartDataArray.length <= 2 || xChartDataArray.length <= 2) {
            return (
                <div className="inner-container-style">
                    Nedostatok dát pre graf
                    <span style={{ fontWeight: "bold" }}>{props.label}</span>
                </div>
            );
        }

        return (
            <>
                <BarChart
                    xAxis={[
                        {
                            scaleType: "band",
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
                minSliderDistance={props.minSliderDistance}
                usedMinSliderDistance={sliderUsedMinDistance}
                setUsedMinSliderDistance={setSliderUsedMinDistance}
                responseBody={props.responseBody}
            />

            {getChartElement()}
        </>
    );
}

export default BarChartWrapper;
