import * as CookiesManager from "../../../../../helpers/CookiesManager.tsx";

import { Client } from "@stomp/stompjs";

import * as React from "react";

interface RandomProps {
    clientSocket: Client;
}

function Random(props: RandomProps) {
    const sessionCookie = React.useRef<string>(
        CookiesManager.getSessionCookie(),
    );

    React.useEffect(() => {
        props.clientSocket.subscribe(
            "/user/" + sessionCookie.current + "/queue/notification/random",
            (message) => {
                const body = message.body;
                console.log("random: " + body);
            },
        );
    }, []);

    return <div>random</div>;
}

export default Random;
