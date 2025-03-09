import * as NeuralNetworkTypes from "./NeuralNetworkModelTypes.tsx";

interface AddDropoutLayerFormProps {
    layers: NeuralNetworkTypes.Layer[];
    setLayers: React.Dispatch<React.SetStateAction<NeuralNetworkTypes.Layer[]>>;
}

function AddDropoutLayerForm(props: AddDropoutLayerFormProps) {
    return <>dropout layer</>;
}

export default AddDropoutLayerForm;
