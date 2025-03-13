import * as CookiesManager from "../../../../../helpers/CookiesManager.tsx";
import * as Utility from "../../../../../helpers/UtilityProvider.tsx";

import { Client } from "@stomp/stompjs";

import * as React from "react";

interface EarlyTrainingStopProps {
    clientSocket: Client;
}

function EarlyTrainingStop(props: EarlyTrainingStopProps) {
    const { openNotification } = Utility.useUtility();

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
                    if (!("action" in json)) {
                        return;
                    }

                    const action = json["action"];
                    const reason = json["reason"];
                    if (action === "training_stopped" && reason === "timeout") {
                        openNotification(
                            "Trénovanie bolo zastavené, došlo k prekročeniu maximálneho časového limitu",
                            "white",
                            "red",
                        );
                    }
                });
            },
        );
    }, []);

    return <></>;
}

export default EarlyTrainingStop;
