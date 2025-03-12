import LossChart from "./results/LossChart.tsx";

import { Client } from "@stomp/stompjs";

interface NeuralNetworkResultProps {
    actionInProgress: boolean;
    clientSocket: Client;
}

function NeuralNetworkResult(props: NeuralNetworkResultProps) {
    return (
        <>
            <div className="custom-container" style={{ marginBottom: "20px" }}>
                <LossChart
                    actionInProgress={props.actionInProgress}
                    clientSocket={props.clientSocket}
                />
            </div>
        </>
    );
}

export default NeuralNetworkResult;
