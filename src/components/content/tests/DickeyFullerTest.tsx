import * as Type from "../../../helpers/Types.tsx";
import DatasetSelector from "../../common/DatasetSelector.tsx";
import Layout from "../../layout/Layout.tsx";

import * as React from "react";

function DickerFullerTest() {
    const [selectedDatasetInfo, setSelectedDatasetInfo] =
        React.useState<Type.DatasetInfo | null>(null);

    const handleDebug = () => {
        console.log(selectedDatasetInfo);
    };

    const content = (
        <div>
            <button onClick={handleDebug}>DEBUG</button>
            <DatasetSelector
                selectedDatasetInfo={selectedDatasetInfo}
                setSelectedDatasetInfo={setSelectedDatasetInfo}
            />
            <p>DK test</p>
        </div>
    );

    return <Layout component={content} />;
}

export default DickerFullerTest;
