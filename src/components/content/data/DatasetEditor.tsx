import { Autocomplete, TextField } from "@mui/material";
import {
    BACKEND_PATH,
    GET_DATASET_FOR_EDITING,
    GET_DATASETS_OF_USER_PATH,
} from "../../../helpers/Constants";
import * as CookieManager from "../../../helpers/CookiesManager";
import {
    DatasetForEditing,
    DatasetInfo,
    FetchRequest,
    RequestResult,
} from "../../../helpers/Types";
import Layout from "../../layout/Layout";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DatasetEditor() {
    const location = useLocation();
    const navigate = useNavigate();

    const [datasetInfos, setDatasetInfos] = useState<DatasetInfo[]>([]);
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        useState<DatasetInfo | null>(null);
    const [datasetForEditing, setDatasetForEditing] =
        useState<DatasetForEditing | null>(null);

    useEffect(() => {
        loadDatasetInfos();
    }, []);

    useEffect(() => {
        initializeAutocomplete();
    }, [datasetInfos]);

    useEffect(() => {
        loadDatasetForEditing();
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
                setDatasetForEditing(responseBody.data);
            } else {
                navigate("/data");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const test = () => {
        console.log("test");
        console.log(selectedDatasetInfo);
        console.log(datasetInfos);
        console.log(datasetForEditing);
    };

    const content = (
        <>
            <button onClick={test}>click</button>
            <div>
                <p>j</p>
            </div>
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
        </>
    );

    return <Layout component={content} />;
}

export default DatasetEditor;
