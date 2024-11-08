import * as CookieManager from "../../helpers/CookiesManager";
import { FetchRequest } from "../../helpers/Types";
import Layout from "../layout/Layout";
import "./Data.css";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import SendIcon from "@mui/icons-material/Send";
import {
    Button,
    Checkbox,
    Fade,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import {
    BACKEND_PATH,
    MAX_FILE_SIZE_BYTES,
    UPLOAD_FILE_PATH,
} from "../../helpers/Constants";

function DataComponent() {
    const [datasetName, setDatasetName] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [startHour, setStartHour] = useState<number>(0);

    const [frequency, setFrequency] = useState<string>("");

    const [dateColumnName, setDateColumnName] = useState<string>("");
    const [dataColumnName, setDataColumnName] = useState<string>("");

    const [datasetHasDateColumn, setDatasetHasDateColumn] =
        useState<boolean>(false);
    const [datasetHasHeaderColumn, setDatasetHasHeaderColumn] =
        useState<boolean>(false);
    const [datasetHasMissingValues, setDatasetHasMissingValues] =
        useState<boolean>(false);

    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (datasetName === "" || file === null || frequency === "") {
            setSubmitDisabled(true);
        } else if (startDate !== null || datasetHasDateColumn) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [datasetName, file, startDate, frequency, datasetHasDateColumn]);

    const handleDatasetNameChange = (newDatasetName: string) => {
        setDatasetName(newDatasetName);
    };

    const handleFileChange = (fileList: FileList | null) => {
        if (!fileList) {
            setFile(null);
        } else {
            const file = fileList[0];
            if (file.size > MAX_FILE_SIZE_BYTES) {
                fileList = null;
                setFile(null);
            } else {
                setFile(file);
            }
        }
    };

    const handleStartDateChange = (date: Dayjs | null) => {
        if (date) {
            setStartDate(date);
        } else {
            setStartDate(null);
        }
    };

    const handleStartHourChange = (hourString: string) => {
        const newHour = Number(hourString);
        if (newHour >= 0 && newHour <= 23) {
            setStartHour(newHour);
        }
    };

    const handleFrequencyChange = (event: SelectChangeEvent) => {
        setFrequency(event.target.value);
    };

    const handleDateColumnNameChange = (newDateColumnName: string) => {
        setDateColumnName(newDateColumnName);
    };

    const handleDataColumnNameChange = (newDataColumnName: string) => {
        setDataColumnName(newDataColumnName);
    };

    const handleDatasetHasHeaderChange = (
        event: React.SyntheticEvent<Element, Event>,
    ) => {
        const element = event.target as HTMLInputElement;
        setDatasetHasHeaderColumn(element.checked);
    };

    const handleDatasetHasDateColumnChange = (
        event: React.SyntheticEvent<Element, Event>,
    ) => {
        const element = event.target as HTMLInputElement;
        setDatasetHasDateColumn(element.checked);
    };

    const handleDatasetHasMissingValuesChange = (
        event: React.SyntheticEvent<Element, Event>,
    ) => {
        const element = event.target as HTMLInputElement;
        setDatasetHasMissingValues(element.checked);
    };

    const resetForm = () => {
        setDatasetName("");
        setFile(null);
        setStartDate(null);
        setStartHour(0);
        setFrequency("");
        setDateColumnName("");
        setDataColumnName("");
        setDatasetHasDateColumn(false);
        setDatasetHasHeaderColumn(false);
        setDatasetHasMissingValues(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (datasetName.trim() === "" || !file || frequency.trim() === "") {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("datasetName", datasetName);
            formData.append("file", file, file.name);

            if (startDate) {
                const startHourString =
                    startHour < 10
                        ? "0" + startHour.toString()
                        : startHour.toString();
                formData.append(
                    "startDateTime",
                    startDate.format("YYYY/MM/DD") + "-" + startHourString,
                );
            }

            formData.append("frequency", frequency);

            if (dateColumnName.trim() !== "") {
                formData.append("dateColumnName", dateColumnName);
            }
            if (dataColumnName.trim() !== "") {
                formData.append("dataColumnName", dataColumnName);
            }

            formData.append(
                "datasetHasDateColumn",
                datasetHasDateColumn.toString(),
            );
            formData.append(
                "datasetHasHeader",
                datasetHasHeaderColumn.toString(),
            );
            formData.append(
                "datasetHasMissingValues",
                datasetHasMissingValues.toString(),
            );

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
                                Názov datasetu{" "}
                                <span style={{ color: "red" }}>*</span>
                            </p>

                            <TextField
                                sx={{ width: 1 }}
                                id="outlined-basic"
                                label="Názov datasetu"
                                variant="outlined"
                                value={datasetName}
                                slotProps={{
                                    htmlInput: { maxLength: 100 },
                                }}
                                onChange={(event) => {
                                    handleDatasetNameChange(
                                        event.currentTarget.value,
                                    );
                                }}
                            />
                        </div>

                        <div className="data-upload-group">
                            <p className="data-upload-group-label">
                                Súbor .csv{" "}
                                <span style={{ color: "red" }}>*</span>
                            </p>

                            <Button
                                sx={{ width: 1, height: "56px" }}
                                component="label"
                                variant="outlined"
                                startIcon={<FileUploadIcon />}
                            >
                                {file?.name
                                    ? "Zvolený súbor: " + file.name
                                    : "Zvoľte súbor"}
                                <input
                                    type="file"
                                    accept=".csv"
                                    hidden
                                    onChange={(event) => {
                                        handleFileChange(
                                            event.currentTarget.files,
                                        );
                                    }}
                                />
                            </Button>
                        </div>

                        <Fade
                            appear={false}
                            timeout={500}
                            in={!datasetHasDateColumn}
                        >
                            <div className="data-upload-group">
                                <p className="data-upload-group-label">
                                    Začiatočný dátum{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </p>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 8, lg: 10 }}>
                                        <DatePicker
                                            sx={{ width: 1 }}
                                            format="YYYY/MM/DD"
                                            value={startDate}
                                            onChange={(date) => {
                                                handleStartDateChange(date);
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 4, lg: 2 }}>
                                        <TextField
                                            sx={{ width: 1 }}
                                            type="number"
                                            id="outlined-basic"
                                            label="Hodina"
                                            variant="outlined"
                                            value={startHour}
                                            onChange={(event) => {
                                                handleStartHourChange(
                                                    event.currentTarget.value,
                                                );
                                            }}
                                            slotProps={{
                                                htmlInput: {
                                                    min: 0,
                                                    max: 23,
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </Fade>

                        <div className="data-upload-group">
                            <p className="data-upload-group-label">
                                Frekvencia{" "}
                                <span style={{ color: "red" }}>*</span>
                            </p>

                            <FormControl sx={{ width: 1 }} fullWidth>
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
                                    <MenuItem value={"quarterly"}>
                                        Štvrťročná
                                    </MenuItem>
                                    <MenuItem value={"yearly"}>Ročná</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="data-upload-group">
                            <p className="data-upload-group-label">
                                Doplňujúce informácie o datasete
                            </p>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, lg: 6 }}>
                                    <TextField
                                        sx={{ width: 1 }}
                                        id="outlined-basic"
                                        label="Názov stĺpca s dátumom"
                                        variant="outlined"
                                        value={dateColumnName}
                                        slotProps={{
                                            htmlInput: { maxLength: 100 },
                                        }}
                                        onChange={(event) => {
                                            handleDateColumnNameChange(
                                                event.currentTarget.value,
                                            );
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, lg: 6 }}>
                                    <TextField
                                        sx={{ width: 1 }}
                                        id="outlined-basic"
                                        label="Názov stĺpca s dátami"
                                        variant="outlined"
                                        value={dataColumnName}
                                        slotProps={{
                                            htmlInput: { maxLength: 100 },
                                        }}
                                        onChange={(event) => {
                                            handleDataColumnNameChange(
                                                event.currentTarget.value,
                                            );
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </div>

                        <div className="data-upload-group">
                            <Grid container spacing={3}>
                                <Grid size={{ sm: 12, md: 6 }}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="medium"
                                                    checked={
                                                        datasetHasDateColumn
                                                    }
                                                    onChange={(event) => {
                                                        handleDatasetHasDateColumnChange(
                                                            event,
                                                        );
                                                    }}
                                                />
                                            }
                                            label="Dataset obsahuje stlpec s&nbsp;dátumom"
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ sm: 12, md: 6 }}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    size="medium"
                                                    checked={
                                                        datasetHasHeaderColumn
                                                    }
                                                    onChange={(event) => {
                                                        handleDatasetHasHeaderChange(
                                                            event,
                                                        );
                                                    }}
                                                />
                                            }
                                            label="Dataset obsahuje hlavičku"
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={12}>
                                    <Box
                                        sx={{
                                            justifyContent: {
                                                xs: "start",
                                                sm: "center",
                                            },
                                        }}
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <Grid>
                                            <FormControlLabel
                                                sx={{ width: 1 }}
                                                control={
                                                    <Checkbox
                                                        size="medium"
                                                        checked={
                                                            datasetHasMissingValues
                                                        }
                                                        onChange={(event) => {
                                                            handleDatasetHasMissingValuesChange(
                                                                event,
                                                            );
                                                        }}
                                                    />
                                                }
                                                label="Dataset obsahuje chýbajúce hodnoty"
                                            />
                                        </Grid>
                                    </Box>
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
