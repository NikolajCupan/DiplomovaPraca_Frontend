import "../index.css";
import * as Constants from "./Constants.tsx";
import * as Type from "./Types.tsx";

import { Dialog, DialogProps, SnackbarContent } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

import * as React from "react";

interface NotificationContent {
    message: string;
    textColor: string;
    backgroundColor: string;
}

interface UtilityContextProps {
    isDialogOpen: boolean;
    openDialog: (
        dialogContent: React.ReactNode,
        isDialogFullWidth?: boolean,
        dialogMaxWidth?: DialogProps["maxWidth"],
    ) => void;
    closeDialog: () => void;

    isNotificationOpen: boolean;
    notificationContent: NotificationContent | undefined | null;
    openNotification: (
        message: string,
        textColor: string,
        backgroundColor: string,
    ) => void;
    openSuitableNotification: (
        response: Response,
        responseBody: Type.RequestResult,
    ) => void;
    closeNotification: () => void;
}

interface UtilityProviderProps {
    children: React.ReactNode;
}

const UtilityContext = React.createContext<UtilityContextProps | null>(null);

export const UtilityProvider = (props: UtilityProviderProps) => {
    const timeoutRef = React.useRef<number | undefined>(undefined);

    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
    const [dialogContent, setDialogContent] =
        React.useState<React.ReactNode>(null);
    const [isDialogFullWidth, setIsDialogFullWidth] =
        React.useState<boolean>(false);
    const [dialogMaxWidth, setDialogMaxWidth] =
        React.useState<DialogProps["maxWidth"]>();

    const [isNotificationOpen, setIsNotificationOpen] =
        React.useState<boolean>(false);
    const [notificationContent, setNotificationContent] =
        React.useState<NotificationContent | null>();

    const openDialog = React.useCallback(
        (
            dialogContent: React.ReactNode,
            isDialogFullWidth?: boolean,
            dialogMaxWidth?: DialogProps["maxWidth"],
        ) => {
            closeNotification();

            setDialogContent(dialogContent);

            if (isDialogFullWidth !== undefined) {
                setIsDialogFullWidth(isDialogFullWidth);
            }

            if (dialogMaxWidth !== undefined) {
                setDialogMaxWidth(dialogMaxWidth);
            }

            setIsDialogOpen(true);
        },
        [],
    );

    const closeDialog = React.useCallback(() => {
        closeNotification();
        setDialogContent(null);
        setIsDialogOpen(false);
    }, []);

    const openNotification = React.useCallback(
        (message: string, textColor: string, backgroundColor: string) => {
            setNotificationContent({
                message: message,
                textColor: textColor,
                backgroundColor: backgroundColor,
            });
            setIsNotificationOpen(true);

            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(function () {
                closeNotification();
            }, Constants.NOTIFICATION_CLOSE_MS);
        },
        [],
    );

    const openSuitableNotification = React.useCallback(
        (response: Response, responseBody: Type.RequestResult) => {
            if (response.status === 400) {
                openNotification(
                    responseBody.message.trim() === ""
                        ? "Pri vykonávaní akcie nastala chyba"
                        : responseBody.message,
                    "white",
                    "red",
                );
            } else if (response.status === 408) {
                openNotification(
                    "Vypršal čas na spracovanie požiadavky",
                    "white",
                    "red",
                );
            }
        },
        [],
    );

    const closeNotification = React.useCallback(() => {
        clearTimeout(timeoutRef.current);
        setNotificationContent(null);
        setIsNotificationOpen(false);
    }, []);

    return (
        <UtilityContext.Provider
            value={{
                isDialogOpen: isDialogOpen,
                openDialog: openDialog,
                closeDialog: closeDialog,
                isNotificationOpen: isNotificationOpen,
                notificationContent,
                openNotification,
                openSuitableNotification,
                closeNotification,
            }}
        >
            {props.children}

            {isDialogOpen && (
                <div>
                    <Dialog
                        open={isDialogOpen}
                        onClose={closeDialog}
                        fullWidth={isDialogFullWidth}
                        maxWidth={dialogMaxWidth}
                        PaperProps={{
                            style: {
                                borderRadius: "var(--default-border-radius)",
                                padding: "20px",
                            },
                        }}
                    >
                        {dialogContent}
                    </Dialog>
                </div>
            )}

            {isNotificationOpen && (
                <div>
                    <Snackbar
                        open={isNotificationOpen}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                    >
                        <SnackbarContent
                            message={notificationContent?.message}
                            sx={{
                                backgroundColor:
                                    notificationContent?.backgroundColor,
                                color: notificationContent?.textColor,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                borderRadius: "var(--default-border-radius)",
                            }}
                        />
                    </Snackbar>
                </div>
            )}
        </UtilityContext.Provider>
    );
};

export const useUtility = (): UtilityContextProps => {
    const context = React.useContext(UtilityContext);
    if (!context) {
        throw new Error("Invalid usage of utility provider");
    }

    return context;
};
