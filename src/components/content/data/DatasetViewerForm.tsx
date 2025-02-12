import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import ConfirmButton from "../../common/inputs/ConfirmButton.tsx";
import DatasetSelector from "../../common/inputs/DatasetSelector.tsx";
import TextInput from "../../common/inputs/TextInput.tsx";
import DatasetViewerTable from "./DatasetViewerTable.tsx";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import * as React from "react";

interface DatasetViewerFormProps {
    datasetForViewing: Type.DatasetForViewing | null;
    setDatasetForViewing: React.Dispatch<
        React.SetStateAction<Type.DatasetForViewing | null>
    >;
}

function DatasetViewerForm(props: DatasetViewerFormProps) {
    const { openNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [newDatasetName, setNewDatasetName] = React.useState<string>("");
    const [newColumnName, setNewColumnName] = React.useState<string>("");

    React.useEffect(() => {
        getDatasetForViewing();
    }, [selectedDatasetInfo]);

    const getDatasetForViewing = async () => {
        try {
            if (!selectedDatasetInfo) {
                props.setDatasetForViewing(null);
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

                props.setDatasetForViewing(datasetForViewing);
            } else {
                openNotification(responseBody.message, "white", "red");
                setSelectedDatasetInfo(null);
                props.setDatasetForViewing(null);
            }
        } catch {}
    };

    const handleConfirmButtonClick = async () => {
        if (!selectedDatasetInfo || !props.datasetForViewing) {
            openNotification("Zvoľte dataset", "white", "red");
            return;
        }

        if (newDatasetName.trim() === "" && newColumnName.trim() === "") {
            return;
        }

        try {
            const formData = new FormData();
            formData.append(
                "idDataset",
                selectedDatasetInfo.idDataset.toString(),
            );
            Helper.appendIfAvailable(
                formData,
                "newDatasetName",
                newDatasetName,
                true,
            );
            Helper.appendIfAvailable(
                formData,
                "newColumnName",
                newColumnName,
                true,
            );

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.EDIT_DATASET_PATH,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookiesManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookiesManager.processResponse(response);

                const responseBody =
                    (await response.json()) as Type.RequestResult;

                const newDatasetName =
                    responseBody.data.datasetInfoDto.datasetName;
                const datasetId = responseBody.data.datasetInfoDto.idDataset;

                const datasetInfosCopy = datasetInfos.slice();
                datasetInfosCopy.forEach((element) => {
                    if (element.idDataset === datasetId) {
                        element.datasetName = newDatasetName;
                    }
                });

                setDatasetInfos(datasetInfosCopy);
                setSelectedDatasetInfo(responseBody.data.datasetInfoDto);

                setNewDatasetName("");
                setNewColumnName("");
            } else {
                openNotification(
                    "Pri vykonávaní akcie nastala chyba",
                    "white",
                    "red",
                );
            }
        } catch {
            openNotification(
                "Pri vykonávaní akcie nastala chyba",
                "white",
                "red",
            );
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

            {selectedDatasetInfo && props.datasetForViewing ? (
                <DatasetViewerTable
                    selectedDatasetInfo={selectedDatasetInfo}
                    datasetForViewing={props.datasetForViewing}
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
                        inputEnabled={props.datasetForViewing !== null}
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
                            inputEnabled={props.datasetForViewing !== null}
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
                submitEnabled={props.datasetForViewing !== null}
            />
        </>
    );
}

export default DatasetViewerForm;
