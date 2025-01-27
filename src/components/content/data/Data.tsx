import { DatasetInfo } from "../../../helpers/Types.tsx";
import Layout from "../../layout/Layout";
import DatasetTable from "./DatasetTable.tsx";
import DatasetUploadForm from "./DatasetUploadForm.tsx";

import * as React from "react";

function Data() {
    const [datasetInfos, setDatasetInfos] = React.useState<DatasetInfo[]>([]);

    const content = (
        <>
            <div style={{ marginBottom: "50px" }}>
                <DatasetUploadForm setDatasetInfos={setDatasetInfos} />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <DatasetTable
                    datasetInfos={datasetInfos}
                    setDatasetInfos={setDatasetInfos}
                />
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default Data;
