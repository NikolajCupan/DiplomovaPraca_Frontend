import Notification, {
    NotificationRef,
} from "../components/common/Notification";

import { useRef } from "react";

function Test() {
    const notificationRef = useRef<NotificationRef>(null);

    const handleOpenNotification = () => {
        notificationRef.current!.open();
    };

    return (
        <>
            <button onClick={handleOpenNotification}>click</button>
            <Notification
                ref={notificationRef}
                message="hiii"
                color="white"
                backgroundColor="green"
            />
        </>
    );
}

export default Test;
