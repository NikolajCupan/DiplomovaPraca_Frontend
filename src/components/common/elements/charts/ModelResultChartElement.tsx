import * as Constants from "../../../../helpers/Constants.tsx";
import * as Helper from "../../../../helpers/Helper.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import ScrollableContainer from "../ScrollableContainer.tsx";
import LineChartWrapper from "./LineChartWrapper.tsx";

interface ModelResultChartElementProps {
    responseBody: Type.RequestResult | null;
}

function ModelResultChartElement(props: ModelResultChartElementProps) {
    if (!props.responseBody) {
        return;
    }

    const responseBodyData: Record<string, any> = JSON.parse(
        props.responseBody.data,
    );
    if (!(Constants.TRAIN_KEY in responseBodyData)) {
        return;
    }

    const chartData: Record<string, any> =
        responseBodyData[Constants.TRAIN_KEY];
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
                height={Constants.DEFAULT_CHART_HEIGHT}
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

export default ModelResultChartElement;
