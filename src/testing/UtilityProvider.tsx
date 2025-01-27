import { Box, SnackbarContent } from "@mui/material";
import MuiModal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: 250,
    maxWidth: 400,
    bgcolor: "background.paper",
    borderRadius: "var(--default-border-radius)",
    boxShadow: 24,
    p: 4,
    padding: 3.5,
};

interface NotificationContent {
    message: string;
    color: string;
    backgroundColor: string;
}

interface UtilityContextProps {
    isModalOpen: boolean;
    openModal: (modalContent: React.ReactNode) => void;
    closeModal: () => void;

    isNotificationOpen: boolean;
    notificationContent: NotificationContent | null | undefined;
    openNotification: (
        message: string,
        color: string,
        backgroundColor: string,
    ) => void;
    closeNotification: () => void;
}

const UtilityContext = createContext<UtilityContextProps | undefined>(
    undefined,
);

interface UtilityProviderProps {
    children: React.ReactNode;
}

export const UtilityProvider = (props: UtilityProviderProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    const openModal = useCallback((modalContent: React.ReactNode) => {
        setModalContent(modalContent);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalContent(null);
        setIsModalOpen(false);
    }, []);

    const [isNotificationOpen, setIsNotificationOpen] =
        useState<boolean>(false);
    const [notificationContent, setNotificationContent] =
        useState<NotificationContent | null>();
    const timeoutRef = useRef<number | undefined>(undefined);

    const openNotification = useCallback(
        (message: string, color: string, backgroundColor: string) => {
            setNotificationContent({
                message: message,
                color: color,
                backgroundColor: backgroundColor,
            });
            setIsNotificationOpen(true);

            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(function () {
                closeNotification();
            }, 3000);
        },
        [],
    );

    const closeNotification = useCallback(() => {
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
                closeNotification,
            }}
        >
            {props.children}

            {isModalOpen && (
                <div>
                    <MuiModal
                        open={isModalOpen}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={modalStyle}>{modalContent}</Box>
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
                                color: notificationContent?.color,
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
    const context = useContext(UtilityContext);
    if (!context) {
        throw new Error("Invalid usage of utility provider");
    }

    return context;
};
