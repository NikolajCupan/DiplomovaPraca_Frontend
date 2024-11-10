import DatasetTable from "./DatasetTable";
import DatasetUploadForm from "./DatasetUploadForm";

import Layout from "../../layout/Layout";

function Data() {
    const content = (
        <>
            <DatasetUploadForm />
            <DatasetTable />
        </>
    );

    return <Layout component={content} />;
}

export default Data;
