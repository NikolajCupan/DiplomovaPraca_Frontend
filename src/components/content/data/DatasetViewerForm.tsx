import { Box } from "@mui/material";
import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import ConfirmButton from "../../common/inputs/ConfirmButton.tsx";
import DatasetSelector from "../../common/inputs/DatasetSelector.tsx";
import TextInput from "../../common/inputs/TextInput.tsx";
import DatasetViewerTable from "./DatasetViewerTable.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

function DatasetViewerForm() {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );

    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);
    const [datasetForViewing, setDatasetForViewing] =
        React.useState<Type.DatasetForViewing | null>(null);

    const [newDatasetName, setNewDatasetName] = React.useState<string>("");
    const [newColumnName, setNewColumnName] = React.useState<string>("");

    React.useEffect(() => {
        loadDatasetForViewing();
    }, [selectedDatasetInfo]);

    const loadDatasetForViewing = async () => {
        try {
            if (!selectedDatasetInfo) {
                setDatasetForViewing(null);
                setNewDatasetName("");
                setNewColumnName("");
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

                let datasetForViewing: Type.DatasetForViewing = {
                    datasetInfo: {
                        idDataset: -1,
                        datasetName: "",
                        columnName: "",
                        rowsCount: -1,
                        frequencyType: "",
                    },
                    rows: [],
                };

                datasetForViewing.datasetInfo.idDataset =
                    responseBody.data.datasetInfoDto.idDataset;
                datasetForViewing.datasetInfo.datasetName =
                    responseBody.data.datasetInfoDto.datasetName;
                datasetForViewing.datasetInfo.columnName =
                    responseBody.data.datasetInfoDto.columnName;
                datasetForViewing.datasetInfo.rowsCount =
                    responseBody.data.datasetInfoDto.rowsCount;
                datasetForViewing.datasetInfo.frequencyType =
                    responseBody.data.datasetInfoDto.frequencyType;

                const rows = responseBody.data.rows;
                for (let i = 0; i < rows.length; ++i) {
                    let newRow: Type.Row = {
                        date: new Date(),
                        value: "",
                    };

                    newRow.date = rows[i].dateTime;
                    newRow.value = rows[i].value;

                    datasetForViewing.rows.push(newRow);
                }

                setDatasetForViewing(datasetForViewing);
            } else {
                openNotification(responseBody.message, "white", "red");
                setSelectedDatasetInfo(null);
                setDatasetForViewing(null);
            }
        } catch {}
    };

    const handleConfirmButtonClick = () => {
        if (!selectedDatasetInfo || !datasetForViewing) {
            return;
        }
    };

    return (
        <>
            <DatasetSelector
                customStyle={{ marginTop: "20px" }}
                datasetInfos={datasetInfos}
                setDatasetInfos={setDatasetInfos}
                selectedDatasetInfo={selectedDatasetInfo}
                setSelectedDatasetInfo={setSelectedDatasetInfo}
            />

            {selectedDatasetInfo && datasetForViewing ? (
                <DatasetViewerTable
                    selectedDatasetInfo={selectedDatasetInfo}
                    datasetForViewing={datasetForViewing}
                />
            ) : (
                <div
                    style={{
                        fontSize: "14px",
                        textAlign: "center",
                        marginTop: "40px",
                        marginBottom: "40px",
                    }}
                >
                    Zvoľte dataset
                </div>
            )}

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInput
                        value={newDatasetName}
                        setValue={setNewDatasetName}
                        toggleable={false}
                        inputEnabled={datasetForViewing !== null}
                        label={"Nový názov datasetu"}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                        sx={{
                            marginTop: {
                                xs: "40px",
                                sm: "0",
                            },
                        }}
                    >
                        <TextInput
                            value={newColumnName}
                            setValue={setNewColumnName}
                            toggleable={false}
                            inputEnabled={datasetForViewing !== null}
                            label={"Nový názov stĺpca s dátami"}
                        />
                    </Box>
                </Grid>
            </Grid>

            <ConfirmButton
                text={"Potvrdiť zmeny"}
                customClass="custom-form-component-margin-top custom-form-component-margin-bottom-small"
                action={handleConfirmButtonClick}
                toggleable={false}
                submitEnabled={datasetForViewing !== null}
            />
        </>
    );
}

export default DatasetViewerForm;
