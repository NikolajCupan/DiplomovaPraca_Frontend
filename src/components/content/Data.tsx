import * as CookieManager from "../../helpers/CookiesManager";
import { FetchRequest } from "../../helpers/Types";
import Layout from "../layout/Layout";
import "./Data.css";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendIcon from "@mui/icons-material/Send";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
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
    const [startHour, setStartHour] = useState<number>(12);
    const [file, setFile] = useState<File | null>(null);
    const [frequency, setFrequency] = useState<string>("");
    const [datasetHasHeader, setDatasetHasHeader] = useState<boolean>(false);
    const [datasetHasDateColumn, setDatasetHasDateColumn] =
        useState<boolean>(false);

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

    const handleStartHourChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const newHour = Number(event.target.value);
        if (newHour >= 0 && newHour <= 23) {
            setStartHour(newHour);
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

    const handleDatasetHasHeader = (
        event: React.SyntheticEvent<Element, Event>,
    ) => {
        const element = event.target as HTMLInputElement;
        setDatasetHasHeader(element.checked);
    };

    const handleDatasetHasDateColumn = (
        event: React.SyntheticEvent<Element, Event>,
    ) => {
        const element = event.target as HTMLInputElement;
        setDatasetHasDateColumn(element.checked);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!startDate || !file || frequency.trim() === "") {
            return;
        }

        try {
            const formData = new FormData();
            formData.append(
                "startDateTime",
                startDate.format("YYYY/MM/DD") + "-" + startHour,
            );
            formData.append("file", file, file.name);
            formData.append("frequency", frequency);
            formData.append("hasHeader", datasetHasHeader.toString());
            formData.append("hasDateColumn", datasetHasDateColumn.toString());

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

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 8, lg: 10 }}>
                                    <DatePicker
                                        format="YYYY/MM/DD"
                                        className="data-upload-group-value"
                                        onChange={(date) => {
                                            handleStartDateChange(date);
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 4, lg: 2 }}>
                                    <TextField
                                        type="number"
                                        className="data-upload-group-value"
                                        id="outlined-basic"
                                        label="Hodina"
                                        variant="outlined"
                                        value={startHour}
                                        onChange={(event) => {
                                            handleStartHourChange(event);
                                        }}
                                        slotProps={{
                                            htmlInput: { min: 0, max: 23 },
                                        }}
                                    />
                                </Grid>
                            </Grid>
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

                        <div className="data-upload-group">
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="medium"
                                                checked={datasetHasDateColumn}
                                                onChange={(event) => {
                                                    handleDatasetHasDateColumn(
                                                        event,
                                                    );
                                                }}
                                            />
                                        }
                                        label="Dataset obsahuje dátum"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="medium"
                                                checked={datasetHasHeader}
                                                onChange={(event) => {
                                                    handleDatasetHasHeader(
                                                        event,
                                                    );
                                                }}
                                            />
                                        }
                                        label="Dataset obsahuje hlavičku"
                                    />
                                </Grid>
                            </Grid>
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
