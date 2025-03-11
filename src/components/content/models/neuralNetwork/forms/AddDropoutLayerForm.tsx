import * as Utility from "../../../../../helpers/UtilityProvider.tsx";
import NumberInput from "../../../../common/inputs/NumberInput.tsx";
import * as NeuralNetworkTypes from "./../NeuralNetworkModelTypes.tsx";
import "./NeuralNetworkModelForm.css";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

import * as React from "react";

interface AddDropoutLayerFormProps {
    addLayer: (newLayer: NeuralNetworkTypes.Layer) => void;
}

function AddDropoutLayerForm(props: AddDropoutLayerFormProps) {
    const { closeDialog, openNotification } = Utility.useUtility();

    const [keepRate, setKeepRate] = React.useState<number>(99);

    const handleAddDropoutLayer = () => {
        const dropoutLayer = {} as NeuralNetworkTypes.DropoutLayer;
        dropoutLayer.keepRate = keepRate;

        props.addLayer(dropoutLayer);
        closeDialog();
        openNotification("Vrstva bola úspešne pridaná", "white", "green");
    };

    return (
        <>
            <div
                style={{
                    textAlign: "center",
                    fontSize: "22px",
                    marginBottom: "30px",
                }}
            >
                Zvoľte parametre vrstvy
            </div>

            <NumberInput
                customClass="custom-form-component-margin-bottom"
                value={keepRate}
                setValue={setKeepRate}
                toggleable={false}
                inputEnabled={true}
                decimalValuesAllowed={false}
                label={"Percento zachovaných neurónov"}
                defaultValue={99}
                minValue={0}
                maxValue={100}
                step={1}
            />

            <div className="button-center">
                <Button
                    style={{ width: "100%" }}
                    variant="contained"
                    endIcon={<AddIcon />}
                    size="large"
                    onClick={handleAddDropoutLayer}
                >
                    Pridať vrstvu
                </Button>
            </div>
        </>
    );
}
export default AddDropoutLayerForm;
