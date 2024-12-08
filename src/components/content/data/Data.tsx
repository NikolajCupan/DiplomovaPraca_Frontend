import { DatasetInfo } from "../../../helpers/Types";
import Notification, { NotificationRef } from "../../common/Notification";
import DatasetTable from "./DatasetTable";
import DatasetUploadForm from "./DatasetUploadForm";

import { useRef, useState } from "react";
import Layout from "../../layout/Layout";

function Data() {
    const notificationRef = useRef<NotificationRef>(null);
    const openNotification = (
        message?: string,
        color?: string,
        backgroundColor?: string,
    ) => {
        notificationRef.current!.open(message, color, backgroundColor);
    };

    const [datasetInfos, setDatasetInfos] = useState<DatasetInfo[]>([]);

    const content = (
        <>
            <Notification
                ref={notificationRef}
                message="n/a"
                color="white"
                backgroundColor="black"
            />

            <div style={{ marginBottom: "50px" }}>
                <DatasetUploadForm
                    setDatasetInfos={setDatasetInfos}
                    openNotification={openNotification}
                />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <DatasetTable
                    datasetInfos={datasetInfos}
                    setDatasetInfos={setDatasetInfos}
                    openNotification={openNotification}
                />
            </div>
        </>
    );

    return <Layout component={content} />;
}

export default Data;
