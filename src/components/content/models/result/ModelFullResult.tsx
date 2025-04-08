import * as Constants from "../../../../helpers/Constants.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import * as VariousElements from "../../../../helpers/VariousElements.tsx";
import Header from "../../../common/elements/Header.tsx";
import ResultElement from "../../../common/elements/ResultElement.tsx";
import ScrollableContainer from "../../../common/elements/ScrollableContainer.tsx";
import AccuracyTable from "./AccuracyTable.tsx";
import DetailedModelResult from "./DetailedModelResult.tsx";
import ModelResultDataTable from "./ModelResultDataTable.tsx";
import RealPredictedDataChart from "./RealPredictedDataChart.tsx";
import ResidualsChart from "./ResidualsChart.tsx";

interface ModelFullResultProps {
    responseBody: Type.RequestResult | null;
    actionInProgress: boolean;
    component?: React.ReactNode;
}

function ModelFullResult(props: ModelFullResultProps) {
    const noActionElement = (
        <div className="custom-container" style={{ marginBottom: "20px" }}>
            <div className="inner-container-style">Vykonajte akciu</div>
        </div>
    );

    if (props.actionInProgress) {
        return (
            <div className="custom-container" style={{ marginBottom: "20px" }}>
                <div className="inner-container-style">
                    {VariousElements.actionInProgressElement}
                </div>
            </div>
        );
    } else if (!props.responseBody) {
        return noActionElement;
    }

    const responseBodyData: Record<string, any> = JSON.parse(
        props.responseBody.data,
    );

    const success = responseBodyData[Constants.SUCCESS_KEY];
    if (!success) {
        return (
            <div className="custom-container" style={{ marginBottom: "20px" }}>
                <ResultElement
                    actionInProgress={props.actionInProgress}
                    responseBody={props.responseBody}
                />
            </div>
        );
    }

    return (
        <>
            <div className="custom-container">
                <Header
                    text={"Prehľad"}
                    breakpointWidth={300}
                    link={[]}
                    excludeInfoTooltip={true}
                />

                <AccuracyTable
                    responseBody={props.responseBody}
                    trainJsonKey={"train_accuracy"}
                    testJsonKey={"test_accuracy"}
                    customStyle={{ marginBottom: "40px" }}
                />

                <ModelResultDataTable responseBody={props.responseBody} />

                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                >
                    <RealPredictedDataChart
                        responseBody={props.responseBody}
                        jsonKey={Constants.FORECAST_KEY}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </ScrollableContainer>
            </div>

            {Constants.SUMMARY_KEY in responseBodyData && (
                <div
                    className="custom-container"
                    style={{ paddingBottom: "40px" }}
                >
                    <DetailedModelResult responseBody={props.responseBody} />
                </div>
            )}

            <div className="custom-container">
                <Header
                    text={"Trénovacia množina"}
                    breakpointWidth={300}
                    link={[]}
                    excludeInfoTooltip={true}
                />

                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                >
                    <RealPredictedDataChart
                        responseBody={props.responseBody}
                        jsonKey={Constants.TRAIN_KEY}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </ScrollableContainer>

                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                >
                    <ResidualsChart
                        responseBody={props.responseBody}
                        jsonKey={Constants.TRAIN_KEY}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </ScrollableContainer>
            </div>

            {Constants.TEST_KEY in responseBodyData && (
                <div className="custom-container">
                    <Header
                        text={"Testovacia množina"}
                        breakpointWidth={300}
                        link={[]}
                        excludeInfoTooltip={true}
                    />

                    <ScrollableContainer
                        breakpointWidth={
                            Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                        }
                    >
                        <RealPredictedDataChart
                            responseBody={props.responseBody}
                            jsonKey={Constants.TEST_KEY}
                            height={Constants.DEFAULT_CHART_HEIGHT}
                        />
                    </ScrollableContainer>

                    <ScrollableContainer
                        breakpointWidth={
                            Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                        }
                    >
                        <ResidualsChart
                            responseBody={props.responseBody}
                            jsonKey={Constants.TEST_KEY}
                            height={Constants.DEFAULT_CHART_HEIGHT}
                        />
                    </ScrollableContainer>
                </div>
            )}

            {props.component !== undefined && props.component}

            <div style={{ marginBottom: "20px" }}></div>
        </>
    );
}

export default ModelFullResult;
