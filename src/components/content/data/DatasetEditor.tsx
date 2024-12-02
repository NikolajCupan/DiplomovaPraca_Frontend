import {
    Autocomplete,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import {
    BACKEND_PATH,
    GET_DATASET_FOR_EDITING,
    GET_DATASETS_OF_USER_PATH,
} from "../../../helpers/Constants";
import * as CookieManager from "../../../helpers/CookiesManager";
import * as Helper from "../../../helpers/Helper";
import {
    DatasetForEditing,
    DatasetInfo,
    FetchRequest,
    RequestResult,
    Row,
} from "../../../helpers/Types";
import Layout from "../../layout/Layout";
import "./DatasetEditor.css";

import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DatasetEditor() {
    const location = useLocation();
    const navigate = useNavigate();

    const [datasetInfos, setDatasetInfos] = useState<DatasetInfo[]>([]);
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        useState<DatasetInfo | null>(null);
    const [datasetForEditing, setDatasetForEditing] =
        useState<DatasetForEditing | null>(null);

    const [changedValues, setChangedValues] = useState<Map<number, string>>(
        new Map(),
    );

    useEffect(() => {
        loadDatasetInfos();
    }, []);

    useEffect(() => {
        initializeAutocomplete();
    }, [datasetInfos]);

    useEffect(() => {
        loadDatasetForEditing();
        setChangedValues(() => {
            const newMap = new Map();
            return newMap;
        });
    }, [selectedDatasetInfo]);

    const loadDatasetInfos = async () => {
        try {
            const request: FetchRequest = {
                url: BACKEND_PATH + GET_DATASETS_OF_USER_PATH,
                options: {
                    method: "get",
                },
            };

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookieManager.processResponse(response);
                const responseBody = (await response.json()) as RequestResult;

                responseBody.data.forEach((element: DatasetInfo) => {
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

            const request: FetchRequest = {
                url: BACKEND_PATH + GET_DATASET_FOR_EDITING,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookieManager.processResponse(response);
                const responseBody = (await response.json()) as RequestResult;

                let datasetForEditing: DatasetForEditing = {
                    datasetInfo: {
                        idDataset: -1,
                        datasetName: "",
                        columnName: "",
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
                datasetForEditing.datasetInfo.frequencyType =
                    responseBody.data.datasetInfoDto.frequencyType;

                const rows = responseBody.data.rows;
                for (let i = 0; i < rows.length; ++i) {
                    let newRow: Row = {
                        date: new Date(),
                        value: "",
                    };

                    newRow.date = rows[i].dateTime;
                    newRow.value = rows[i].value;

                    datasetForEditing.rows.push(newRow);
                }

                setDatasetForEditing(datasetForEditing);
            } else {
                navigate("/data");
            }
        } catch {}
    };

    const handleNewValueChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    const test = () => {
        console.log("\n\n\n----------");
        console.log("DATASET INFOS");
        console.log(datasetInfos);
        console.log("SELECTED DATASET INFO");
        console.log(selectedDatasetInfo);
        console.log("DATASET FOR EDITING");
        console.log(datasetForEditing);
        console.log("CHANGED VALUES");

        changedValues.forEach((value, key) => {
            console.log(key, value);
        });
    };

    const content = (
        <>
            <button style={{ marginBottom: "100px" }} onClick={test}>
                click
            </button>

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
            />

            <div className="data-table-container">
                <TableContainer sx={{ maxHeight: 600, overflow: "auto" }}>
                    <Table sx={{ minWidth: 650 }}>
                        <colgroup>
                            <col style={{ width: "50%" }} />
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "25%" }} />
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
                                        <TableRow key={index}>
                                            <TableCell align="left">
                                                {dateString}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.value === ""
                                                    ? "-"
                                                    : row.value}
                                            </TableCell>
                                            <TableCell className="editor-input-cell">
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
                                                        className="editor-input-field"
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
            </div>

            <p id="testik"></p>
        </>
    );

    return <Layout component={content} />;
}

export default DatasetEditor;
