import {
    BACKEND_PATH,
    DOWNLOAD_DATASET_PATH,
    GET_DATASETS_OF_USER_PATH,
} from "../../../helpers/Constants";
import * as CookieManager from "../../../helpers/CookiesManager";
import * as Helper from "../../../helpers/Helper";
import {
    DatasetInfo,
    FetchRequest,
    RequestResult,
} from "../../../helpers/Types";
import "./DatasetTable.css";

import DownloadIcon from "@mui/icons-material/Download";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";

interface DatasetTableProps {
    datasetInfos: DatasetInfo[];
    setDatasetInfos: Dispatch<SetStateAction<DatasetInfo[]>>;
}

function DatasetTable(props: DatasetTableProps) {
    useEffect(() => {
        loadDatasets();
    }, []);

    const loadDatasets = async () => {
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
                const newDatasets = responseBody.data.map(
                    (arrayElement: unknown) => arrayElement as DatasetInfo,
                );

                props.setDatasetInfos((prevDatasets) => [
                    ...prevDatasets,
                    ...newDatasets,
                ]);
            }
        } catch {}
    };

    const handleDownloadDataset = async (idDataset: number) => {
        try {
            const formData = new FormData();
            formData.append("idDataset", idDataset.toString());

            const request: FetchRequest = {
                url: BACKEND_PATH + DOWNLOAD_DATASET_PATH,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                console.log("ok");
            } else {
                console.log("not ok");
            }
        } catch {}
    };

    return (
        <>
            <div className="data-table-container">
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <colgroup>
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "25%" }} />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="left">Názov</TableCell>
                                <TableCell align="left">Frekvencia</TableCell>
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
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                aria-label="edit-dataset"
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
                                    <TableCell colSpan={4} align="center">
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
