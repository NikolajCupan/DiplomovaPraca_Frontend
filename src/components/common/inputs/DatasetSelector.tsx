import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Type from "../../../helpers/Types.tsx";

import { Autocomplete, TextField } from "@mui/material";

import * as React from "react";
import * as ReactRouter from "react-router-dom";

interface DatasetSelectorProps {
    datasetInfos: Type.DatasetInfo[];
    setDatasetInfos: React.Dispatch<React.SetStateAction<Type.DatasetInfo[]>>;

    selectedDatasetInfo: Type.DatasetInfo | null;
    setSelectedDatasetInfo: React.Dispatch<
        React.SetStateAction<Type.DatasetInfo | null>
    >;

    keepArrow?: boolean;
    customClass?: string;
    customStyle?: React.CSSProperties;
}

function DatasetSelector(props: DatasetSelectorProps) {
    const location = ReactRouter.useLocation();

    React.useEffect(() => {
        loadDatasetInfos();
    }, []);

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

            CookiesManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookiesManager.processResponse(response);

                const responseBody =
                    (await response.json()) as Type.RequestResult;
                responseBody.data.reverse();
                responseBody.data.forEach((element: Type.DatasetInfo) => {
                    props.setDatasetInfos((prevDatasetInfos) => [
                        ...prevDatasetInfos,
                        element,
                    ]);
                });

                initializeAutocomplete(responseBody.data as Type.DatasetInfo[]);
            }
        } catch {}
    };

    const initializeAutocomplete = (datasetInfos: Type.DatasetInfo[]) => {
        if (location.state?.idDataset != null) {
            const dataset = datasetInfos.find(
                (dataset) => dataset.idDataset === location.state.idDataset,
            );

            if (dataset) {
                props.setSelectedDatasetInfo(dataset);
            }
        }
    };

    return (
        <Autocomplete
            className={props.customClass}
            value={props.selectedDatasetInfo || null}
            options={props.datasetInfos}
            getOptionLabel={(option) =>
                `${option.datasetName} (ID: ${option.idDataset})`
            }
            isOptionEqualToValue={(option, value) =>
                option.idDataset === value.idDataset
            }
            renderInput={(params) => <TextField {...params} label="Dataset" />}
            onChange={(_, newValue) => {
                props.setSelectedDatasetInfo(newValue);
            }}
            forcePopupIcon={props.keepArrow ?? true}
            noOptionsText="Žiadny dataset nie je k dispozícii"
            style={{ ...props.customStyle, width: "100%" }}
        />
    );
}

export default DatasetSelector;
