import * as Constants from "../../../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../../../helpers/CookiesManager.tsx";
import * as Type from "../../../../../helpers/Types.tsx";
import LineChartWrapper from "../../../../common/elements/charts/LineChartWrapper.tsx";
import ScrollableContainer from "../../../../common/elements/ScrollableContainer.tsx";
import Header from "../../../../common/elements/Header.tsx";

import { Client } from "@stomp/stompjs";

import * as React from "react";

interface LossChartProps {
    actionInProgress: boolean;
    clientSocket: Client;
}

function LossChart(props: LossChartProps) {
    const [lossBody, setLossBody] = React.useState<Type.RequestResult | null>(
        null,
    );
    const [accuracyBody, setAccuracyBody] =
        React.useState<Type.RequestResult | null>(null);

    const epochs = React.useRef<string[]>([]);
    const losses = React.useRef<string[]>([]);
    const accuracies = React.useRef<string[]>([]);

    const sessionCookie = React.useRef<string>(
        CookiesManager.getSessionCookie(),
    );

    React.useEffect(() => {
        props.clientSocket.subscribe(
            "/user/" + sessionCookie.current + "/queue/notification/loss",
            (message) => {
                const body = message.body;
                const messages: string[] = body
                    .split("\n")
                    .filter((message) => message.trim() !== "");

                messages.forEach((stringJson) => {
                    const json: Record<any, string> = JSON.parse(stringJson);

                    const newEpoch = json["epoch"];
                    epochs.current.push(newEpoch);

                    const newLoss = json["loss"];
                    losses.current.push(newLoss);

                    const newAccuracy = json["accuracy"];
                    accuracies.current.push(newAccuracy);

                    let dataJsonLosses: Record<string, any> = {};
                    dataJsonLosses["loss"] = { result: losses.current };
                    dataJsonLosses["epoch"] = { result: epochs.current };

                    let dataJsonAccuracies: Record<string, any> = {};
                    dataJsonAccuracies["accuracy"] = {
                        result: accuracies.current,
                    };
                    dataJsonAccuracies["epoch"] = { result: epochs.current };

                    const lossesResult: Type.RequestResult = {
                        message: "",
                        data: JSON.stringify(dataJsonLosses),
                    };

                    const accuraciesResult: Type.RequestResult = {
                        message: "",
                        data: JSON.stringify(dataJsonAccuracies),
                    };

                    setLossBody(lossesResult);
                    setAccuracyBody(accuraciesResult);
                });
            },
        );
    }, []);

    React.useEffect(() => {
        if (props.actionInProgress) {
            setLossBody(null);
            setAccuracyBody(null);
            epochs.current = [];
            losses.current = [];
            accuracies.current = [];
        }
    }, [props.actionInProgress]);

    let content;
    if (losses.current.length <= 2 || accuracies.current.length <= 2) {
        content = (
            <div className="inner-container-style">
                Trénovanie bolo spustené
            </div>
        );
    } else {
        content = (
            <>
                <Header
                    text={"Trénovanie"}
                    breakpointWidth={300}
                    link={[]}
                    excludeInfoTooltip={true}
                />

                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                    customStyle={{ marginBottom: "20px" }}
                >
                    <LineChartWrapper
                        label={"Loss"}
                        xAxisArrayKey={"epoch"}
                        yAxisArrayKey={"loss"}
                        responseBody={lossBody!}
                        skipAnimation={true}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </ScrollableContainer>

                <ScrollableContainer
                    breakpointWidth={
                        Constants.DEFAULT_SCROLLABLE_CONTAINER_BREAKPOINT_WIDTH
                    }
                >
                    <LineChartWrapper
                        label={"Presnosť"}
                        xAxisArrayKey={"epoch"}
                        yAxisArrayKey={"accuracy"}
                        responseBody={accuracyBody!}
                        skipAnimation={true}
                        height={Constants.DEFAULT_CHART_HEIGHT}
                    />
                </ScrollableContainer>
            </>
        );
    }

    return content;
}

export default LossChart;
