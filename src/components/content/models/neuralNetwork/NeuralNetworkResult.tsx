import * as Type from "../../../../helpers/Types.tsx";
import Header from "../../../common/elements/Header.tsx";
import AccuracyTable from "../result/AccuracyTable.tsx";
import ModelResultDataTable from "../result/ModelResultDataTable.tsx";
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

                    {<ModelResultDataTable responseBody={props.responseBody} />}
                </div>
            )}

            <div style={{ marginBottom: "20px" }}></div>
        </>
    );
}

export default NeuralNetworkResult;
