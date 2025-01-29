import * as Type from "../../helpers/Types.tsx";
import * as Constants from "../../helpers/Constants.tsx";
import * as CookiesManager from "../../helpers/CookiesManager.tsx";

import { Autocomplete, TextField } from "@mui/material";

import * as React from "react";

function DatasetSelector() {
    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

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
                    setDatasetInfos((prevDatasetInfos) => [
                        ...prevDatasetInfos,
                        element,
                    ]);
                });
            }
        } catch {}
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "50px",
            }}
        >
            <Autocomplete
                value={selectedDatasetInfo}
                options={datasetInfos}
                getOptionLabel={(option) =>
                    `${option.datasetName} (ID: ${option.idDataset})`
                }
                isOptionEqualToValue={(option, value) =>
                    option.idDataset === value.idDataset
                }
                sx={{ width: 500, marginTop: "20px" }}
                renderInput={(params) => (
                    <TextField {...params} label="Dataset" />
                )}
                onChange={(_, newValue) => {
                    setSelectedDatasetInfo(newValue);
                }}
                noOptionsText="Žiadny dataset nie je k dispozícii"
            />
        </div>
    );
}

export default DatasetSelector;
