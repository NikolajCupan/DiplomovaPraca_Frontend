import * as Constants from "../../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../../helpers/CookiesManager.tsx";
import * as Type from "../../../../helpers/Types.tsx";
import "../../../../index.css";
import Layout from "../../../layout/Layout.tsx";
import NeuralNetworkModelForm from "./NeuralNetworkModelForm.tsx";

import { Client } from "@stomp/stompjs";

import * as React from "react";

function NeuralNetworkModel() {
    const [actionInProgress, setActionInProgress] =
        React.useState<boolean>(false);
    const [responseBody, setResponseBody] =
        React.useState<Type.RequestResult | null>(null);

    const clientSocket = React.useRef<Client | null>(null);

    React.useEffect(() => {
        initializeClientSocket();

        return () => {
            if (clientSocket.current) {
                clientSocket.current.deactivate();
            }
        };
    }, []);

    const initializeClientSocket = async () => {
        if (!CookiesManager.getSessionCookie()) {
            const result: boolean = await makeGetCookieRequest();

            if (!result) {
                return;
            }
        }

        const sessionCookie = CookiesManager.getSessionCookie();
        const websocketLink = Constants.WEBSOCKET_LINK;

        clientSocket.current = new Client({
            brokerURL: websocketLink,
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000,
            reconnectDelay: 0,
            connectHeaders: {
                login: sessionCookie!,
            },
            disconnectHeaders: {
                login: sessionCookie!,
            },
        });

        if (clientSocket.current) {
            clientSocket.current.onConnect = () => {
                clientSocket.current!.subscribe(
                    "/user/" + sessionCookie + "/queue/notification",
                    (message) => {
                        console.log("received: " + message);
                    },
                );
            };

            clientSocket.current.activate();
        }
    };

    const makeGetCookieRequest = async () => {
        const request: Type.FetchRequest = {
            url: Constants.BACKEND_PATH + Constants.GET_COOKIE,
            options: {
                method: "get",
            },
        };

        const response = await fetch(request.url, request.options);

        if (response.ok) {
            CookiesManager.processResponse(response);
            return true;
        } else {
            return false;
        }
    };

    const content = (
        <>
            <div className="custom-container">
                <NeuralNetworkModelForm
                    actionInProgress={actionInProgress}
                    setActionInProgress={setActionInProgress}
                    responseBody={responseBody}
                    setResponseBody={setResponseBody}
                />
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default NeuralNetworkModel;
