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

function DataComponent() {
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [frequency, setFrequency] = useState<string>("");
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

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
            setFile(file);
        }
    };

    const handleFrequencyChange = (event: SelectChangeEvent) => {
        setFrequency(event.target.value);
    };

    useEffect(() => {
        if (startDate === null || file === null || frequency === "") {
            setSubmitDisabled(true);
        } else {
            setSubmitDisabled(false);
        }
    }, [startDate, file, frequency]);

    const dump = () => {
        console.log("Start date: ");
        if (startDate) {
            console.log(startDate);
        }

        console.log("File: ");
        if (file) {
            console.log(file);
        }

        console.log("Frequency: ");
        if (frequency) {
            console.log(frequency);
        }
    };

    return (
        <>
            <div className="data-upload-wrapper">
                <h1 className="data-upload-title">Upload nového súboru</h1>

                <fieldset>
                    <form action="#" method="get">
                        <div className="data-upload-field">
                            <p className="data-upload-label">
                                Začiatočný dátum
                            </p>

                            <DatePicker
                                className="data-upload-value"
                                onChange={(date) => {
                                    handleStartDateChange(date);
                                }}
                            />
                        </div>

                        <div className="data-upload-field">
                            <p className="data-upload-label">Súbor .csv</p>

                            <Button
                                className="data-upload-value"
                                component="label"
                                variant="outlined"
                                startIcon={<FileUploadIcon />}
                            >
                                {file?.name
                                    ? "Zvolený súbor: " + file.name
                                    : "Zvoľte súbor"}
                                <div className="file-upload">
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

                        <div className="data-upload-field">
                            <p className="data-upload-label">Frekvencia</p>
                            <FormControl
                                fullWidth
                                className="data-upload-value"
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
                            onClick={(event) => {
                                handleSubmit(event);
                            }}
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

            <div className="dole"></div>
            <button onClick={dump}>Dump</button>
        </>
    );
}

export default function Data() {
    return <Layout component={DataComponent} />;
}
