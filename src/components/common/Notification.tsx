import { SnackbarContent } from "@mui/material";
import Slide from "@mui/material/Slide";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

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
    open: (message?: string, color?: string, backgroundColor?: string) => void;
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
        const timeoutRef = useRef<number | undefined>(undefined);

        useImperativeHandle(ref, () => ({
            open: (
                message?: string,
                color?: string,
                backgroundColor?: string,
            ) => {
                setNotificationState((prevState) => ({
                    ...prevState,
                    open: true,
                    message: message ? message : prevState.message,
                    color: color ? color : prevState.color,
                    backgroundColor: backgroundColor
                        ? backgroundColor
                        : prevState.backgroundColor,
                }));

                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(function () {
                    setNotificationState((prevState) => ({
                        ...prevState,
                        open: false,
                    }));
                }, 3000);
            },
        }));

        return (
            <div>
                <Snackbar
                    open={notificationState.open}
                    message="Note archived"
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
                            borderRadius: "var(--default-border-radius)",
                        }}
                    />
                </Snackbar>
            </div>
        );
    },
);

export default Notification;
