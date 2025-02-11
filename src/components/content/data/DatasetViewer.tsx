import "../../../index.css";
import Layout from "../../layout/Layout.tsx";
import DatasetViewerForm from "./DatasetViewerForm.tsx";

function DatasetViewer() {
    const content = (
        <>
            <div className="custom-container">
                <DatasetViewerForm />
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default DatasetViewer;
