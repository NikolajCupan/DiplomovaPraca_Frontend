import { Box } from "@mui/material";
import MuiModal from "@mui/material/Modal";
import { forwardRef, useImperativeHandle, useState } from "react";

const style = {
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

export interface ModalRef {
    open: (innerComponent: React.ReactNode) => void;
    close: () => void;
}

const Modal = forwardRef<ModalRef>((_, ref) => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const [content, setContent] = useState<React.ReactNode>(null);

    useImperativeHandle(ref, () => ({
        open: (innerComponent: React.ReactNode) => {
            console.log("open");
            setContent(innerComponent);
            setOpen(true);
        },
        close: () => {
            setOpen(false);
        },
    }));

    return (
        <div>
            <MuiModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>{content}</Box>
            </MuiModal>
        </div>
    );
});

export default Modal;
