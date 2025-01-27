import * as Constants from "../../../helpers/Constants.tsx";
import * as CookieManager from "../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import Layout from "../../layout/Layout.tsx";
import "./DatasetEditor.css";

import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import {
    Autocomplete,
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

import * as React from "react";
import * as ReactRouter from "react-router-dom";

const Item = styled(Paper)(({}) => ({
    textAlign: "center",
    boxShadow: "none",
    border: "none",
}));

function DatasetEditor() {
    const { openModal, closeModal, openNotification } = Utility.useUtility();

    const location = ReactRouter.useLocation();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);
    const [datasetForEditing, setDatasetForEditing] =
        React.useState<Type.DatasetForEditing | null>(null);

    const [newColumnName, setNewColumnName] = React.useState<string>("");
    const [changedValues, setChangedValues] = React.useState<
        Map<number, string>
    >(new Map());

    const [buttonConfirmDisabled, setButtonConfirmDisabled] =
        React.useState<boolean>(true);

    React.useEffect(() => {
        loadDatasetInfos();
    }, []);

    React.useEffect(() => {
        initializeAutocomplete();
    }, [datasetInfos]);

    React.useEffect(() => {
        loadDatasetForEditing();
        clearChangedValuesInputs();
    }, [selectedDatasetInfo]);

    React.useEffect(() => {
        if (changedValues.size <= 0 && newColumnName.trim() === "") {
            setButtonConfirmDisabled(true);
        } else {
            setButtonConfirmDisabled(false);
        }
    }, [newColumnName, changedValues]);

    const loadDatasetInfos = async () => {
        try {
            const request: Type.FetchRequest = {
                url:
                    Constants.BACKEND_PATH +
                    Constants.GET_DATASETS_OF_USER_PATH,
                options: {
                    method: "get",
                },
            };

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookieManager.processResponse(response);

                const responseBody =
                    (await response.json()) as Type.RequestResult;
                responseBody.data.reverse();
                responseBody.data.forEach((element: Type.DatasetInfo) => {
                    setDatasetInfos((prevDatasetInfos) => [
                        ...prevDatasetInfos,
                        element,
                    ]);
                });
            }
        } catch {}
    };

    const initializeAutocomplete = () => {
        if (location.state?.idDataset != null) {
            const dataset = datasetInfos.find(
                (dataset) => dataset.idDataset === location.state.idDataset,
            );

            if (dataset) {
                setSelectedDatasetInfo(dataset);
            }
        }
    };

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

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);
            const responseBody = (await response.json()) as Type.RequestResult;

            if (response.ok) {
                CookieManager.processResponse(response);

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

    const handleNewColumnNameChange = (newColumnName: string) => {
        setNewColumnName(newColumnName);
    };

    const handleNewValueChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const value = event.target.value.trim();
        const numberValue: number = Number(value);
        const previousValue: string | null = changedValues.has(index)
            ? (changedValues.get(index) as string)
            : null;

        if (value !== "" && !Number.isNaN(numberValue)) {
            setChangedValues((prevChangedValues) => {
                const newMap = new Map(prevChangedValues);
                newMap.set(index, value);
                return newMap;
            });
        } else if (value === "-") {
            setChangedValues((prevChangedValues) => {
                const newMap = new Map(prevChangedValues);
                newMap.set(index, "-");
                return newMap;
            });
        } else if (previousValue != null && value === "") {
            setChangedValues((prevChangedValues) => {
                const newMap = new Map(prevChangedValues);
                newMap.delete(index);
                return newMap;
            });
        }
    };

    const handleConfirmChanges = async () => {
        if (buttonConfirmDisabled) {
            return;
        }

        let changedRows: Type.Row[] = [];

        changedValues.forEach((_, key) => {
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

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);
            const responseBody = (await response.json()) as Type.RequestResult;

            if (response.ok) {
                CookieManager.processResponse(response);

                openNotification(responseBody.message, "white", "green");

                loadDatasetForEditing();
                clearChangedValuesInputs();
            } else {
                openNotification(responseBody.message, "white", "red");
            }
        } catch {}
    };

    const clearChangedValuesInputs = () => {
        setChangedValues(() => {
            const newMap = new Map();
            return newMap;
        });
        setNewColumnName("");
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

        const originalMap = changedValues;
        const newMap = new Map();

        originalMap.forEach((value, index) => {
            newMap.set(index + startCount, value);
        });

        setChangedValues(newMap);
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
                    }}
                >
                    Pridanie dát
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

    const content = (
        <>
            <input type="hidden" id="new-start-data-count-hidden" value="0" />
            <input type="hidden" id="new-end-data-count-hidden" value="0" />

            <Autocomplete
                value={selectedDatasetInfo}
                options={datasetInfos}
                getOptionLabel={(option) =>
                    `${option.datasetName} (ID: ${option.idDataset})`
                }
                isOptionEqualToValue={(option, value) =>
                    option.idDataset === value.idDataset
                }
                sx={{ width: 500 }}
                renderInput={(params) => (
                    <TextField {...params} label="Dataset" />
                )}
                onChange={(_, newValue) => {
                    setSelectedDatasetInfo(newValue);
                }}
                noOptionsText="Daný dataset neexistuje"
            />

            <div className="data-table-container">
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
                                                        value={
                                                            changedValues.has(
                                                                index,
                                                            )
                                                                ? changedValues.get(
                                                                      index,
                                                                  )
                                                                : ""
                                                        }
                                                        onChange={(event) =>
                                                            handleNewValueChange(
                                                                index,
                                                                event,
                                                            )
                                                        }
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
                                    value={newColumnName}
                                    onChange={(event) => {
                                        handleNewColumnNameChange(
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
                                    id="data-upload-submit-button"
                                    disabled={buttonConfirmDisabled}
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
        </>
    );

    return <Layout component={content} />;
}

export default DatasetEditor;
