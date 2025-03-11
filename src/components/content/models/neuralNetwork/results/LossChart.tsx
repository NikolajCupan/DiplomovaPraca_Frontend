import * as Constants from "../../../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../../../helpers/CookiesManager.tsx";
import * as Type from "../../../../../helpers/Types.tsx";
import LineChartWrapper from "../../../../common/elements/charts/LineChartWrapper.tsx";

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

    return (
        <>
            <LineChartWrapper
                label={"loss"}
                xAxisArrayKey={"epoch"}
                yAxisArrayKey={"loss"}
                responseBody={lossBody!}
                skipAnimation={true}
                height={Constants.DEFAULT_CHART_HEIGHT}
            />

            <LineChartWrapper
                label={"accuracy"}
                xAxisArrayKey={"epoch"}
                yAxisArrayKey={"accuracy"}
                responseBody={accuracyBody!}
                skipAnimation={true}
                height={Constants.DEFAULT_CHART_HEIGHT}
            />
        </>
    );
}

export default LossChart;
