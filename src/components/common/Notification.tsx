import { SnackbarContent } from "@mui/material";
import Slide from "@mui/material/Slide";
import Snackbar, {
    SnackbarCloseReason,
    SnackbarOrigin,
} from "@mui/material/Snackbar";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useImperativeHandle, useState } from "react";

interface State extends SnackbarOrigin {
    open: boolean;
    message: string;
    color: string;
    backgroundColor: string;
    Transition: React.ComponentType<
        TransitionProps & {
            children: React.ReactElement<any, any>;
        }
    >;
}

export interface NotificationRef {
    open: () => void;
}

interface NotificationProps {
    message: string;
    color: string;
    backgroundColor: string;
}

const Notification = forwardRef<NotificationRef, NotificationProps>(
    (props, ref) => {
        const [notificationState, setNotificationState] = useState<State>({
            open: false,
            message: props.message,
            color: props.color,
            backgroundColor: props.backgroundColor,
            Transition: Slide,
            vertical: "top",
            horizontal: "center",
        });

        useImperativeHandle(ref, () => ({
            open: () => {
                setNotificationState((prevState) => ({
                    ...prevState,
                    open: true,
                }));
            },
        }));

        const openNotification = () => {
            if (!notificationState.open) {
                setNotificationState((prevState) => ({
                    ...prevState,
                    open: true,
                }));
            }
        };

        const handleClose = (_: any, reason?: SnackbarCloseReason) => {
            if (reason === null) {
                return;
            }

            if (reason === "timeout") {
                setNotificationState((prevState) => ({
                    ...prevState,
                    open: false,
                }));
            }
        };

        return (
            <div>
                <Snackbar
                    open={notificationState.open}
                    autoHideDuration={3000}
                    message="Note archived"
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: notificationState.vertical,
                        horizontal: notificationState.horizontal,
                    }}
                    TransitionComponent={notificationState.Transition}
                >
                    <SnackbarContent
                        message={notificationState.message}
                        sx={{
                            backgroundColor: notificationState.backgroundColor,
                            color: notificationState.color,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            borderRadius: "15px",
                        }}
                    />
                </Snackbar>
            </div>
        );
    },
);

export default Notification;
