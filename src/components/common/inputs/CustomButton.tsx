import SendIcon from "@mui/icons-material/Send";
import { Box, Button } from "@mui/material";

interface CustomButtonProps {
    text: string;
    action: () => void;

    toggleable: boolean;
    submitEnabled: boolean;
    setSubmitEnabled?: React.Dispatch<React.SetStateAction<boolean>>;

    customClass?: string;
    customStyle?: React.CSSProperties;

    icon?: React.ReactNode;
}

function CustomButton(props: CustomButtonProps) {
    return (
        <div
            style={{
                width: "100%",
            }}
        >
            <Box
                sx={{
                    margin: "auto",
                    width: "50%",
                    "@media (max-width: 750px)": {
                        width: "60%",
                    },
                    "@media (max-width: 500px)": {
                        width: "100%",
                    },
                }}
            >
                <Button
                    onClick={props.action}
                    className={props.customClass}
                    style={{ ...props.customStyle, width: "100%" }}
                    disabled={!props.submitEnabled}
                    size="large"
                    variant="contained"
                    endIcon={
                        props.icon === undefined ? <SendIcon /> : props.icon
                    }
                >
                    {props.text}
                </Button>
            </Box>
        </div>
    );
}

export default CustomButton;
