import * as Constants from "./Constants.tsx";
import * as Type from "./Types.tsx";

import { Box, SnackbarContent } from "@mui/material";
import MuiModal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";

import * as React from "react";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "var(--default-border-radius)",
    boxShadow: 24,
    p: 4,
    padding: 3.5,
};

interface NotificationContent {
    message: string;
    textColor: string;
    backgroundColor: string;
}

interface UtilityContextProps {
    isModalOpen: boolean;
    openModal: (
        modalContent: React.ReactNode,
        customModalStyles?: React.CSSProperties,
        customClass?: string,
    ) => void;
    closeModal: () => void;

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

    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [modalContent, setModalContent] =
        React.useState<React.ReactNode>(null);
    const [customModalStyles, setCustomModalStyles] =
        React.useState<React.CSSProperties>();
    const [customModalClass, setCustomModalClass] = React.useState<string>("");

    const [isNotificationOpen, setIsNotificationOpen] =
        React.useState<boolean>(false);
    const [notificationContent, setNotificationContent] =
        React.useState<NotificationContent | null>();

    const openModal = React.useCallback(
        (
            modalContent: React.ReactNode,
            customModalStyles?: React.CSSProperties,
            customClass?: string,
        ) => {
            closeNotification();

            setModalContent(modalContent);
            setCustomModalStyles(customModalStyles || {});
            setCustomModalClass(customClass || "");
            setIsModalOpen(true);
        },
        [],
    );

    const closeModal = React.useCallback(() => {
        setModalContent(null);
        setIsModalOpen(false);
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
                isModalOpen: isModalOpen,
                openModal,
                closeModal,
                isNotificationOpen: isNotificationOpen,
                notificationContent,
                openNotification,
                openSuitableNotification,
                closeNotification,
            }}
        >
            {props.children}

            {isModalOpen && (
                <div>
                    <MuiModal open={isModalOpen} onClose={closeModal}>
                        <Box
                            className={customModalClass}
                            sx={{ ...modalStyle, ...customModalStyles }}
                        >
                            {modalContent}
                        </Box>
                    </MuiModal>
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
