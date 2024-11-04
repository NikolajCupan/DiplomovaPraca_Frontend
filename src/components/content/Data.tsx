import * as CookieManager from "../../helpers/CookiesManager";
import { FetchRequest } from "../../helpers/Types";
import Layout from "../layout/Layout";
import "./Data.css";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendIcon from "@mui/icons-material/Send";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { ChangeEvent, useEffect, useState } from "react";
import {
    BACKEND_PATH,
    MAX_FILE_SIZE_BYTES,
    UPLOAD_FILE_PATH,
} from "../../helpers/Constants";

function DataComponent() {
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [frequency, setFrequency] = useState<string>("");
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (startDate === null || file === null || frequency === "") {
            setSubmitDisabled(true);
        } else {
            setSubmitDisabled(false);
        }
    }, [startDate, file, frequency]);

    const handleStartDateChange = (date: Dayjs | null) => {
        if (date) {
            setStartDate(date);
        } else {
            setStartDate(null);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            setFile(null);
        } else {
            const file = event.target.files[0];
            if (file.size > MAX_FILE_SIZE_BYTES) {
                event.target.files = null;
                setFile(null);
            } else {
                setFile(file);
            }
        }
    };

    const handleFrequencyChange = (event: SelectChangeEvent) => {
        setFrequency(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!startDate || !file || frequency.trim() === "") {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("startDate", startDate.toString());
            formData.append("file", file, file.name);
            formData.append("frequency", frequency);

            const request: FetchRequest = {
                url: BACKEND_PATH + UPLOAD_FILE_PATH,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookieManager.processResponse(response);
            }
        } catch {}
    };

    return (
        <>
            <div className="data-upload-container">
                <h1 className="data-upload-main-title">Upload nového súboru</h1>

                <fieldset>
                    <form action="#" method="post" onSubmit={handleSubmit}>
                        <div className="data-upload-group">
                            <p className="data-upload-group-label">
                                Začiatočný dátum
                            </p>

                            <DatePicker
                                className="data-upload-group-value"
                                onChange={(date) => {
                                    handleStartDateChange(date);
                                }}
                            />
                        </div>

                        <div className="data-upload-group">
                            <p className="data-upload-group-label">
                                Súbor .csv
                            </p>

                            <Button
                                className="data-upload-group-value"
                                component="label"
                                variant="outlined"
                                startIcon={<FileUploadIcon />}
                            >
                                {file?.name
                                    ? "Zvolený súbor: " + file.name
                                    : "Zvoľte súbor"}
                                <div className="data-upload-file">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        hidden
                                        onChange={(event) => {
                                            handleFileChange(event);
                                        }}
                                    />
                                </div>
                            </Button>
                        </div>

                        <div className="data-upload-group">
                            <p className="data-upload-group-label">
                                Frekvencia
                            </p>
                            <FormControl
                                fullWidth
                                className="data-upload-group-value"
                            >
                                <InputLabel
                                    id="input-label-select-frequency"
                                    sx={{
                                        margin: "auto",
                                    }}
                                >
                                    Frekvencia
                                </InputLabel>
                                <Select
                                    labelId="sinput-label-select-frequency"
                                    id="select-frequency"
                                    value={frequency}
                                    label="Frekvencia"
                                    onChange={(event) => {
                                        handleFrequencyChange(event);
                                    }}
                                >
                                    <MenuItem value={"hourly"}>
                                        Hodinová
                                    </MenuItem>
                                    <MenuItem value={"daily"}>Denná</MenuItem>
                                    <MenuItem value={"weekly"}>
                                        Týždená
                                    </MenuItem>
                                    <MenuItem value={"monthly"}>
                                        Mesačná
                                    </MenuItem>
                                    <MenuItem value={"quaterly"}>
                                        Štvrťročná
                                    </MenuItem>
                                    <MenuItem value={"yearly"}>Ročná</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <Button
                            id="data-upload-submit-button"
                            disabled={submitDisabled}
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                            type="submit"
                            size="large"
                            variant="contained"
                            endIcon={<SendIcon />}
                        >
                            Odoslať
                        </Button>
                    </form>
                </fieldset>
            </div>
        </>
    );
}

export default function Data() {
    return <Layout component={DataComponent} />;
}
