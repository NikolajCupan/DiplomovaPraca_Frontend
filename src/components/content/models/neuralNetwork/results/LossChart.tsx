import * as CookiesManager from "../../../../../helpers/CookiesManager.tsx";

import { Client } from "@stomp/stompjs";

import * as React from "react";

interface LossChartProps {
    clientSocket: Client;
}

function LossChart(props: LossChartProps) {
    const sessionCookie = React.useRef<string>(
        CookiesManager.getSessionCookie(),
    );

    React.useEffect(() => {
        props.clientSocket.subscribe(
            "/user/" + sessionCookie.current + "/queue/notification/loss",
            (message) => {
                const body = message.body;
            },
        );
    }, []);

    return <div>loss chart</div>;
}

export default LossChart;
