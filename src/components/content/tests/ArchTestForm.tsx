import * as Constants from "../../../helpers/Constants.tsx";
import * as CookiesManager from "../../../helpers/CookiesManager.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import * as Utility from "../../../helpers/UtilityProvider.tsx";
import Header from "../../common/elements/Header.tsx";
import CustomButton from "../../common/inputs/CustomButton.tsx";
import DatasetSelector from "../../common/inputs/DatasetSelector.tsx";
import NumberInput from "../../common/inputs/NumberInput.tsx";

import Grid from "@mui/material/Grid2";

import * as React from "react";

interface ArchTestFormProps {
    actionInProgress: boolean;
    setActionInProgress: React.Dispatch<React.SetStateAction<boolean>>;

    responseBody: Type.RequestResult | null;
    setResponseBody: React.Dispatch<
        React.SetStateAction<Type.RequestResult | null>
    >;
}

function ArchTestForm(props: ArchTestFormProps) {
    const { openNotification, openSuitableNotification } = Utility.useUtility();

    const [datasetInfos, setDatasetInfos] = React.useState<Type.DatasetInfo[]>(
        [],
    );
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const [pValue, setPValue] = React.useState<number>(0.05);

    const [maxLag, setMaxLag] = React.useState<number>(1);
    const [maxLagEnabled, setMaxLagEnabled] = React.useState<boolean>(false);

    const [dfCount, setDfCount] = React.useState<number>(0);
    const [dfCountEnabled, setDfCountEnabled] = React.useState<boolean>(false);

    const handleConfirmButtonClick = async () => {
        if (props.actionInProgress) {
            return;
        }

        if (!selectedDatasetInfo) {
            openNotification("Zvoľte dataset", "white", "red");
            return;
        }

        props.setActionInProgress(true);

        try {
            const formData = new FormData();
            formData.append(
                "idDataset",
                selectedDatasetInfo.idDataset.toString(),
            );
            formData.append("pValue", pValue.toString());
            Helper.appendIfAvailable(formData, "nlags", maxLag, maxLagEnabled);
            Helper.appendIfAvailable(formData, "ddof", dfCount, dfCountEnabled);

            const request: Type.FetchRequest = {
                url: Constants.BACKEND_PATH + Constants.ARCH_TEST,
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

                props.setResponseBody(responseBody);
            } else {
                props.setResponseBody(null);
                openSuitableNotification(response, responseBody);
            }
        } catch {
            props.setResponseBody(null);
            openNotification(
                "Pri vykonávaní testu nastala chyba",
                "white",
                "red",
            );
        }

        props.setActionInProgress(false);
    };

    return (
        <>
            <Header
                text={"ARCH test"}
                breakpointWidth={300}
                link={
                    "https://www.statsmodels.org/dev/generated/statsmodels.stats.diagnostic.het_arch.html"
                }
            />

            <DatasetSelector
                datasetInfos={datasetInfos}
                setDatasetInfos={setDatasetInfos}
                selectedDatasetInfo={selectedDatasetInfo}
                setSelectedDatasetInfo={setSelectedDatasetInfo}
            />

            <Grid container columnSpacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={pValue}
                        setValue={setPValue}
                        toggleable={false}
                        inputEnabled={true}
                        limitValuesAllowed={false}
                        label={"Hladina významnosti"}
                        defaultValue={0.05}
                        minValue={0}
                        maxValue={1}
                        step={0.01}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        customClass="custom-form-component-margin-top"
                        value={maxLag}
                        setValue={setMaxLag}
                        toggleable={true}
                        inputEnabled={maxLagEnabled}
                        setInputEnabled={setMaxLagEnabled}
                        label={"Maximálny lag"}
                        defaultValue={1}
                        minValue={1}
                        step={1}
                    />
                </Grid>
            </Grid>

            <NumberInput
                customClass="custom-form-component-margin-top"
                value={dfCount}
                setValue={setDfCount}
                toggleable={true}
                inputEnabled={dfCountEnabled}
                setInputEnabled={setDfCountEnabled}
                label={"Počet stupňov voľnosti"}
                defaultValue={0}
                minValue={0}
                step={1}
            />

            <CustomButton
                action={handleConfirmButtonClick}
                text={"Vykonať test"}
                customClass="custom-form-component-margin-top custom-form-component-margin-bottom-small"
                toggleable={false}
                submitEnabled={!props.actionInProgress}
            />
        </>
    );
}

export default ArchTestForm;
