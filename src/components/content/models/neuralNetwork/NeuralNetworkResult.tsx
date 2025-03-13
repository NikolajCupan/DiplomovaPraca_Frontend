import * as Type from "../../../../helpers/Types.tsx";
import ModelFullResult from "../result/ModelFullResult.tsx";
import EarlyTrainingStop from "./results/EarlyTrainingStop.tsx";
import LossChart from "./results/LossChart.tsx";

import { Client } from "@stomp/stompjs";

interface NeuralNetworkResultProps {
    responseBody: Type.RequestResult | null;
    actionInProgress: boolean;
    clientSocket: Client;
}

function NeuralNetworkResult(props: NeuralNetworkResultProps) {
    const resultDataIsAvailable = (): boolean => {
        return !props.actionInProgress && props.responseBody !== null;
    };

    return (
        <>
            <EarlyTrainingStop clientSocket={props.clientSocket} />

            <div className="custom-container">
                <LossChart
                    actionInProgress={props.actionInProgress}
                    clientSocket={props.clientSocket}
                />
            </div>

            {resultDataIsAvailable() && (
                <ModelFullResult
                    responseBody={props.responseBody}
                    actionInProgress={props.actionInProgress}
                />
            )}

            <div style={{ marginBottom: "20px" }}></div>
        </>
    );
}

export default NeuralNetworkResult;
