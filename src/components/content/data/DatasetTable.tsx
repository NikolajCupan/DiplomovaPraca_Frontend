import {
    BACKEND_PATH,
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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";

interface DatasetTableProps {
    datasetInfos: DatasetInfo[];
    setDatasetInfos: Dispatch<SetStateAction<DatasetInfo[]>>;
}

function DatasetTable(props: DatasetTableProps) {
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
            } else {
                console.log("NOT OK");
            }
        } catch {
            console.log("Problem!");
        }
    };

    useEffect(() => {
        loadDatasets();
    }, []);

    return (
        <>
            <div className="data-table-container">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Názov</TableCell>
                            <TableCell align="right">Frekvencia</TableCell>
                            <TableCell align="right">Upraviť</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.datasetInfos.length > 0 ? (
                            props.datasetInfos.map((datasetInfo) => (
                                <TableRow
                                    key={datasetInfo.idDataset}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {datasetInfo.idDataset}
                                    </TableCell>
                                    <TableCell align="right">
                                        {datasetInfo.datasetName}
                                    </TableCell>
                                    <TableCell align="right">
                                        {Helper.translateFrequency(
                                            datasetInfo.frequencyType,
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <button>Edit</button>
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
            </div>
        </>
    );
}

export default DatasetTable;
