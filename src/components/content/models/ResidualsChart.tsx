import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import ScrollableContainer from "../../common/elements/ScrollableContainer.tsx";
import LineChartWrapper from "../../common/elements/charts/LineChartWrapper.tsx";

interface ResidualsChartProps {
    responseBody: Type.RequestResult | null;
    jsonKey: string;
    height: number;
}

function ResidualsChart(props: ResidualsChartProps) {
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
    const json = Helper.transformToJsonWithKeys(
        chartData,
        Constants.MODEL_RESIDUALS_KEY,
        Constants.MODEL_DATE_KEY,
    );

    return (
        <ScrollableContainer
            breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
        >
            <LineChartWrapper
                label={"Reziduá"}
                xAxisArrayKey={"date"}
                yAxisArrayKey={"data"}
                responseBody={json}
                height={props.height}
                isXAxisDate={true}
                frequency={
                    responseBodyData[Constants.FREQUENCY_TYPE_KEY][
                        Constants.OUTPUT_ELEMENT_RESULT_KEY
                    ]
                }
            />
        </ScrollableContainer>
    );
}

export default ResidualsChart;
