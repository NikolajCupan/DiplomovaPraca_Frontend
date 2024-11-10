import { DatasetInfo } from "../../../helpers/Types";
import DatasetTable from "./DatasetTable";
import DatasetUploadForm from "./DatasetUploadForm";

import { useState } from "react";
import Layout from "../../layout/Layout";

function Data() {
    const [datasetInfos, setDatasetInfos] = useState<DatasetInfo[]>([]);

    const content = (
        <>
            <div style={{ marginBottom: "50px" }}>
                <DatasetUploadForm setDatasetInfos={setDatasetInfos} />
            </div>

            <div style={{ marginBottom: "50px" }}>
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
