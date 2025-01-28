import * as Constants from "../../../helpers/Constants.tsx";
import * as CookieManager from "../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import "./Data.css";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
    Box,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import * as React from "react";
import * as ReactRouter from "react-router-dom";

interface DatasetTableProps {
    datasetInfos: Type.DatasetInfo[];
    setDatasetInfos: React.Dispatch<React.SetStateAction<Type.DatasetInfo[]>>;
}

function DatasetTable(props: DatasetTableProps) {
    const { openModal, closeModal, openNotification } = Utility.useUtility();
    const navigate = ReactRouter.useNavigate();

    React.useEffect(() => {
        loadDatasets();
    }, []);

    const loadDatasets = async () => {
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
                const newDatasets: Type.DatasetInfo[] = responseBody.data.map(
                    (arrayElement: unknown) => arrayElement as Type.DatasetInfo,
                );

                props.setDatasetInfos((prevDatasets) => [
                    ...newDatasets.reverse(),
                    ...prevDatasets,
                ]);
            }
        } catch {}
    };

    const handleDownloadDataset = async (idDataset: number) => {
        try {
            const formData = new FormData();
            formData.append("idDataset", idDataset.toString());

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.DOWNLOAD_DATASET_PATH,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookieManager.processResponse(response);

                const blob = await response.blob();
                const newBlob = new Blob([blob]);

                const blobUrl = window.URL.createObjectURL(newBlob);

                const link = document.createElement("a");
                link.href = blobUrl;
                link.setAttribute(
                    "download",
                    `${response.headers.get("dataset-name")}.${"csv"}`,
                );

                document.body.appendChild(link);

                link.click();
                link.parentNode!.removeChild(link);

                window.URL.revokeObjectURL(blobUrl);
            } else {
                openNotification(
                    "Dataset nebolo možné stiahnuť",
                    "white",
                    "red",
                );
            }
        } catch {}
    };

    const handleEditClick = (idDataset: number) => {
        navigate(Constants.EDIT_DATASET_LINK, { state: { idDataset } });
    };

    const handleDeleteClick = (idDataset: number) => {
        openModal(
            <>
                <p
                    style={{
                        marginTop: "0",
                        fontWeight: "bold",
                        fontSize: "25px",
                    }}
                >
                    Potvrdenie zmazania
                </p>
                <p>
                    Ste si istý, že chcete vymazať daný dataset? Akciu nie je
                    možné vrátiť späť
                </p>
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
                        onClick={closeModal}
                        style={{ backgroundColor: "green" }}
                    >
                        Zrušiť
                    </Button>
                    <Button
                        type="submit"
                        size="medium"
                        variant="contained"
                        style={{ backgroundColor: "red" }}
                        onClick={() => handleDeleteDataset(idDataset)}
                    >
                        Zmazať
                    </Button>
                </Box>
            </>,
        );
    };

    const handleDeleteDataset = async (idDataset: number) => {
        closeModal();

        try {
            const formData = new FormData();
            formData.append("idDataset", idDataset.toString());

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.DELETE_DATASET,
                options: {
                    method: "delete",
                    body: formData,
                },
            };

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookieManager.processResponse(response);

                openNotification(
                    "Dataset bol úspešne zmazaný",
                    "white",
                    "green",
                );

                const responseBody =
                    (await response.json()) as Type.RequestResult;
                const deletedDatasetInfo =
                    responseBody.data as Type.DatasetInfo;

                props.setDatasetInfos((prevDatasets) =>
                    prevDatasets.filter(
                        (dataset) =>
                            dataset.idDataset !== deletedDatasetInfo.idDataset,
                    ),
                );
            } else {
                openNotification("Dataset nebolo možné zmazať", "white", "red");
            }
        } catch {}
    };

    return (
        <>
            <div className="data-element-container">
                <TableContainer sx={{ maxHeight: 600, overflow: "auto" }}>
                    <Table sx={{ minWidth: 650 }}>
                        <colgroup>
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "20%" }} />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="left">Názov</TableCell>
                                <TableCell align="left">Frekvencia</TableCell>
                                <TableCell align="left">Počet dát</TableCell>
                                <TableCell align="right">Upraviť</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.datasetInfos.length > 0 ? (
                                props.datasetInfos.map((datasetInfo) => (
                                    <TableRow
                                        key={datasetInfo.idDataset}
                                        sx={{
                                            "&:last-child td, &:last-child th":
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {datasetInfo.idDataset}
                                        </TableCell>
                                        <TableCell align="left">
                                            {datasetInfo.datasetName}
                                        </TableCell>
                                        <TableCell align="left">
                                            {Helper.translateFrequency(
                                                datasetInfo.frequencyType,
                                            )}
                                        </TableCell>
                                        <TableCell align="left">
                                            {datasetInfo.rowsCount}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ minWidth: "125px" }}
                                        >
                                            <IconButton
                                                color="primary"
                                                aria-label="delete-dataset"
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        datasetInfo.idDataset,
                                                    )
                                                }
                                            >
                                                <DeleteForeverIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit-dataset"
                                                onClick={() =>
                                                    handleEditClick(
                                                        datasetInfo.idDataset,
                                                    )
                                                }
                                            >
                                                <ModeEditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                aria-label="download-dataset"
                                                onClick={() => {
                                                    handleDownloadDataset(
                                                        datasetInfo.idDataset,
                                                    );
                                                }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Žiadne dáta nie sú k dispozícii
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}

export default DatasetTable;
