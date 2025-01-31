import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import DatasetSelector from "../../common/DatasetSelector.tsx";
import Layout from "../../layout/Layout.tsx";
import "./DatasetEditor.css";

import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import {
    Box,
    Button,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LineChart } from "@mui/x-charts/LineChart";

import * as React from "react";

const Item = styled(Paper)(({}) => ({
    textAlign: "center",
    boxShadow: "none",
    border: "none",
}));

let newColumnName: string = "";
const changeNewColumnNameValue = (value: string) => {
    newColumnName = value;
};
const clearNewColumnName = () => {
    newColumnName = "";

    (
        document.getElementById(
            "dataset-data-new-column-name",
        ) as HTMLInputElement
    ).value = "";
};

let updatedData: Map<number, string> = new Map();
const changeUpdatedDataValue = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
    const value = event.target.value.trim();
    const numberValue: number = Number(value);
    const previousValue: string | null = updatedData.has(index)
        ? (updatedData.get(index) as string)
        : null;

    if (value !== "" && !Number.isNaN(numberValue)) {
        updatedData.set(index, value);
    } else if (value === "-") {
        updatedData.set(index, "-");
    } else if (previousValue != null && value === "") {
        updatedData.delete(index);
    }

    event.target.value = updatedData.get(index) || "";
};

const clearUpdatedData = () => {
    updatedData = new Map();
    clearInputsDOM();
};

const clearInputsDOM = () => {
    const divs = document.getElementsByClassName("updated-data-field");
    for (let i = 0; i < divs.length; ++i) {
        const input = divs[i].querySelector("input");
        (input as HTMLInputElement).value = "";
    }
};

function DatasetEditor() {
    const { openModal, closeModal, openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);
    const [datasetForEditing, setDatasetForEditing] =
        React.useState<Type.DatasetForEditing | null>(null);

    React.useEffect(() => {
        loadDatasetForEditing();
        clearChangedValuesInputs();
    }, [selectedDatasetInfo]);

    const loadDatasetForEditing = async () => {
        try {
            if (selectedDatasetInfo == null) {
                setDatasetForEditing(null);
                return;
            }

            const formData = new FormData();
            formData.append(
                "idDataset",
                selectedDatasetInfo.idDataset.toString(),
            );

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.GET_DATASET_FOR_EDITING,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookiesManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);
            const responseBody = (await response.json()) as Type.RequestResult;

            if (response.ok) {
                CookiesManager.processResponse(response);

                let datasetForEditing: Type.DatasetForEditing = {
                    datasetInfo: {
                        idDataset: -1,
                        datasetName: "",
                        columnName: "",
                        rowsCount: -1,
                        frequencyType: "",
                    },
                    rows: [],
                };

                datasetForEditing.datasetInfo.idDataset =
                    responseBody.data.datasetInfoDto.idDataset;
                datasetForEditing.datasetInfo.datasetName =
                    responseBody.data.datasetInfoDto.datasetName;
                datasetForEditing.datasetInfo.columnName =
                    responseBody.data.datasetInfoDto.columnName;
                datasetForEditing.datasetInfo.rowsCount =
                    responseBody.data.datasetInfoDto.rowsCount;
                datasetForEditing.datasetInfo.frequencyType =
                    responseBody.data.datasetInfoDto.frequencyType;

                const rows = responseBody.data.rows;
                for (let i = 0; i < rows.length; ++i) {
                    let newRow: Type.Row = {
                        date: new Date(),
                        value: "",
                    };

                    newRow.date = rows[i].dateTime;
                    newRow.value = rows[i].value;

                    datasetForEditing.rows.push(newRow);
                }

                setDatasetForEditing(datasetForEditing);
            } else {
                openNotification(responseBody.message, "white", "red");
                setSelectedDatasetInfo(null);
                setDatasetForEditing(null);
            }
        } catch {}
    };

    const handleConfirmChanges = async () => {
        if (newColumnName === "" && updatedData.size === 0) {
            openNotification("Neboli zadané žiadne zmeny", "white", "red");
            return;
        }

        let changedRows: Type.Row[] = [];

        updatedData.forEach((_, key) => {
            const row: HTMLTableRowElement = document.getElementById(
                "dataset-for-editing-table-row-" + key,
            ) as HTMLTableRowElement;

            let changedRow: Type.Row = { date: "", value: "" };

            const cells: HTMLTableCellElement[] = [...row.cells];
            cells.forEach((element: HTMLTableCellElement) => {
                if (
                    element.classList.contains("dataset-for-editing-date-cell")
                ) {
                    changedRow.date = element.textContent!;
                } else if (
                    element.classList.contains(
                        "dataset-for-editing-changed-value-cell",
                    )
                ) {
                    changedRow.value = element.querySelector("input")!.value;
                }
            });

            changedRows.push(changedRow);
        });

        if (changedRows.length === 0 && newColumnName.trim() === "") {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("newColumnName", newColumnName);

            formData.append(
                "idDataset",
                selectedDatasetInfo!.idDataset.toString(),
            );
            formData.append("rows", JSON.stringify(changedRows));

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.EDIT_DATASET,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookiesManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);
            const responseBody = (await response.json()) as Type.RequestResult;

            if (response.ok) {
                CookiesManager.processResponse(response);

                openNotification(responseBody.message, "white", "green");

                loadDatasetForEditing();
                clearChangedValuesInputs();
            } else {
                openNotification(responseBody.message, "white", "red");
            }
        } catch {}
    };

    const clearChangedValuesInputs = () => {
        clearUpdatedData();
        clearNewColumnName();
    };

    const handleNewStartDataCountChange = (value: number) => {
        const inputElement = document.getElementById(
            "new-start-data-count-hidden",
        ) as HTMLInputElement;
        inputElement.value = value.toString();
    };

    const handleNewEndDataCountChange = (value: number) => {
        const inputElement = document.getElementById(
            "new-end-data-count-hidden",
        ) as HTMLInputElement;
        inputElement.value = value.toString();
    };

    const handleNewDataModalClose = () => {
        closeModal();

        const inputElementStart = document.getElementById(
            "new-start-data-count-hidden",
        ) as HTMLInputElement;
        inputElementStart.value = "0";

        const inputElementEnd = document.getElementById(
            "new-end-data-count-hidden",
        ) as HTMLInputElement;
        inputElementEnd.value = "0";
    };

    const handleNewDataModalConfirm = () => {
        const inputElementStart = document.getElementById(
            "new-start-data-count-hidden",
        ) as HTMLInputElement;
        const inputElementEnd = document.getElementById(
            "new-end-data-count-hidden",
        ) as HTMLInputElement;

        let startCount = parseInt(inputElementStart.value);
        let endCount = parseInt(inputElementEnd.value);

        if (Number.isNaN(startCount) && Number.isNaN(endCount)) {
            openNotification("Neplatné hodnoty", "white", "red");
            return;
        }

        startCount = Number.isNaN(startCount) ? 0 : startCount;
        endCount = Number.isNaN(endCount) ? 0 : endCount;

        if (
            startCount < 0 ||
            endCount < 0 ||
            startCount > 100 ||
            endCount > 100
        ) {
            openNotification(
                "Hodnoty musia byť z rozsahu <0, 100>",
                "white",
                "red",
            );
            return;
        }

        const frequency = datasetForEditing!.datasetInfo.frequencyType;

        let firstRow = datasetForEditing!.rows[0];
        const newStartRows: Type.Row[] = [];
        for (let i = 0; i < startCount; ++i) {
            let newRow: Type.Row = {
                date: new Date(),
                value: "",
            };

            newRow.date = Helper.getPreviousDate(
                firstRow.date as Date,
                frequency,
            );

            newStartRows.unshift(newRow);
            firstRow = newStartRows[0];
        }

        let lastRow =
            datasetForEditing!.rows[datasetForEditing!.rows.length - 1];
        const newEndRows: Type.Row[] = [];
        for (let i = 0; i < endCount; ++i) {
            let newRow: Type.Row = {
                date: new Date(),
                value: "",
            };

            newRow.date = Helper.getNextDate(lastRow.date as Date, frequency);

            newEndRows.push(newRow);
            lastRow = newEndRows[newEndRows.length - 1];
        }

        setDatasetForEditing((prevState) => {
            if (prevState) {
                return {
                    ...prevState,
                    rows: [...newStartRows, ...prevState.rows, ...newEndRows],
                };
            }
            return prevState;
        });

        clearUpdatedData();
        handleNewDataModalClose();
    };

    const handleAddDataClick = async () => {
        openModal(
            <>
                <p
                    style={{
                        marginTop: "0",
                        fontWeight: "bold",
                        fontSize: "25px",
                        marginBottom: "0",
                    }}
                >
                    Pridanie dát
                </p>

                <p
                    style={{
                        marginTop: "5px",
                        marginBottom: "25px",
                        fontSize: "15px",
                    }}
                >
                    <span style={{ color: "red", fontWeight: "bold" }}>
                        Varovanie:{" "}
                    </span>
                    pridanie nových dát spôsobí zmazanie zadaných hodnôt
                </p>

                <Grid container>
                    <Grid size={12}>
                        <TextField
                            id="dataset-data-new-data-start"
                            label="Počet nových dát na začiatku"
                            variant="outlined"
                            type="number"
                            style={{ width: "100%" }}
                            onChange={(event) =>
                                handleNewStartDataCountChange(
                                    parseInt(event.currentTarget.value),
                                )
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            defaultValue={0}
                        />
                    </Grid>

                    <Grid size={12}>
                        <TextField
                            id="dataset-data-new-data-end"
                            label="Počet nových dát na konci"
                            variant="outlined"
                            style={{ width: "100%", marginTop: "30px" }}
                            type="number"
                            onChange={(event) =>
                                handleNewEndDataCountChange(
                                    parseInt(event.currentTarget.value),
                                )
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            defaultValue={0}
                        />
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "30px",
                    }}
                >
                    <Button
                        type="submit"
                        size="medium"
                        variant="contained"
                        style={{ backgroundColor: "red" }}
                        onClick={handleNewDataModalClose}
                    >
                        Zrušiť
                    </Button>
                    <Button
                        type="submit"
                        size="medium"
                        variant="contained"
                        style={{ backgroundColor: "green" }}
                        onClick={handleNewDataModalConfirm}
                    >
                        Pridať
                    </Button>
                </Box>
            </>,
        );
    };

    const getChartData = (): (number | null)[] => {
        if (!datasetForEditing) {
            return [];
        }

        let processedData: (number | null)[] = [];
        datasetForEditing.rows.forEach(function (row: Type.Row) {
            if (row.value.trim() === "") {
                processedData.push(null);
            } else {
                processedData.push(Number(row.value));
            }
        });

        return processedData;
    };

    const getChartAxisX = (): Date[] => {
        if (!datasetForEditing) {
            return [];
        }

        let processedData: Date[] = [];
        datasetForEditing.rows.forEach(function (row: Type.Row) {
            if (typeof row.date === "string") {
                processedData.push(Helper.stringToDate(row.date));
            } else {
                processedData.push(row.date);
            }
        });

        return processedData;
    };

    const formatChartValueX = (value: Date): string => {
        const formattedDate = Helper.formatDate(value);

        switch (selectedDatasetInfo?.frequencyType) {
            case "hourly":
                return formattedDate;
            case "daily":
            case "weekly":
                return formattedDate.substring(0, 10);
            case "monthly":
            case "quarterly":
                return formattedDate.substring(0, 7);
            case "yearly":
                return formattedDate.substring(0, 4);
        }

        return "n/a";
    };

    const content = (
        <>
            <input type="hidden" id="new-start-data-count-hidden" value="0" />
            <input type="hidden" id="new-end-data-count-hidden" value="0" />

            <div className="data-element-container">
                <div className="dataset-selector">
                    <DatasetSelector
                        datasetInfos={datasetInfos}
                        setDatasetInfos={setDatasetInfos}
                        selectedDatasetInfo={selectedDatasetInfo}
                        setSelectedDatasetInfo={setSelectedDatasetInfo}
                    />
                </div>

                <TableContainer sx={{ maxHeight: 600, overflow: "auto" }}>
                    <Table
                        id="dataset-for-editing-table"
                        sx={{ minWidth: 650 }}
                    >
                        <colgroup>
                            <col style={{ width: "60%" }} />
                            <col style={{ minWidth: "200px", width: "20%" }} />
                            <col style={{ minWidth: "200px", width: "20%" }} />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell>Dátum (YYYY/MM/DD-HH)</TableCell>
                                <TableCell>
                                    {datasetForEditing != null
                                        ? datasetForEditing.datasetInfo
                                              .columnName
                                        : "Data"}
                                </TableCell>
                                <TableCell align="left">Nová hodnota</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datasetForEditing != null ? (
                                datasetForEditing.rows.map((row, index) => {
                                    const date = new Date(row.date);
                                    const dateString = Helper.formatDate(date);

                                    return (
                                        <TableRow
                                            id={
                                                "dataset-for-editing-table-row-" +
                                                index
                                            }
                                            key={index}
                                        >
                                            <TableCell
                                                className="dataset-for-editing-date-cell"
                                                align="left"
                                            >
                                                {dateString}
                                            </TableCell>
                                            <TableCell
                                                className="dataset-for-editing-original-value-cell"
                                                align="left"
                                            >
                                                {row.value === ""
                                                    ? "-"
                                                    : row.value}
                                            </TableCell>
                                            <TableCell className="dataset-for-editing-changed-value-cell editor-input-cell">
                                                <label className="editor-input-cell-label">
                                                    <TextField
                                                        className="updated-data-field"
                                                        onChange={(event) =>
                                                            changeUpdatedDataValue(
                                                                index,
                                                                event,
                                                            )
                                                        }
                                                        slotProps={{
                                                            htmlInput: {
                                                                maxLength: 100,
                                                            },
                                                        }}
                                                        variant="standard"
                                                    />
                                                </label>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        Zvoľte dataset
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Grid container>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Item>
                            <div
                                className="dataset-data-new-column-name"
                                style={{ width: "100%" }}
                            >
                                <TextField
                                    id="dataset-data-new-column-name"
                                    label="Nový názov stĺpca s dátami"
                                    variant="outlined"
                                    slotProps={{
                                        htmlInput: {
                                            maxLength: 100,
                                        },
                                    }}
                                    style={{ width: "100%" }}
                                    onChange={(event) => {
                                        changeNewColumnNameValue(
                                            event.currentTarget.value,
                                        );
                                    }}
                                    disabled={selectedDatasetInfo === null}
                                />
                            </div>
                        </Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Item>
                            <div className="dataset-data-add-data-button">
                                <Button
                                    size="large"
                                    variant="contained"
                                    endIcon={<AddIcon />}
                                    onClick={handleAddDataClick}
                                    disabled={selectedDatasetInfo === null}
                                >
                                    Pridať dáta
                                </Button>
                            </div>
                        </Item>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Item>
                            <div className="dataset-data-submit-button">
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={handleConfirmChanges}
                                >
                                    Potvrdiť zmeny
                                </Button>
                            </div>
                        </Item>
                    </Grid>
                </Grid>
            </div>

            <div
                style={{ marginBottom: "20px" }}
                className="data-element-container"
            >
                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                        "@media (max-width: 1000px)": {
                            overflowX: "scroll",
                        },
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            minWidth: 1000,
                        }}
                    >
                        {datasetForEditing !== null ? (
                            <LineChart
                                xAxis={[
                                    {
                                        data: getChartAxisX(),
                                        scaleType: "time",
                                        valueFormatter: (value) => {
                                            return formatChartValueX(value);
                                        },
                                        tickNumber:
                                            getChartAxisX().length < 25
                                                ? getChartAxisX().length
                                                : 15,
                                    },
                                ]}
                                series={[
                                    {
                                        curve: "linear",
                                        data: getChartData(),
                                        showMark: false,
                                    },
                                ]}
                                height={500}
                                sx={{
                                    width: "100%",
                                    pointerEvents: "none",
                                }}
                            />
                        ) : (
                            <p style={{ fontSize: "14px" }}>Zvoľte dataset</p>
                        )}
                    </div>
                </Box>
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default DatasetEditor;
