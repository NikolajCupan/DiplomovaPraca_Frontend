import {
    BACKEND_PATH,
    GET_DATASET_FOR_EDITING,
} from "../../../helpers/Constants";
import * as CookieManager from "../../../helpers/CookiesManager";
import { FetchRequest, RequestResult } from "../../../helpers/Types";
import Layout from "../../layout/Layout";

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DatasetEditor() {
    const { idDataset } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadDataset();
    }, []);

    const loadDataset = async () => {
        try {
            const formData = new FormData();
            formData.append("idDataset", idDataset!.toString());

            const request: FetchRequest = {
                url: BACKEND_PATH + GET_DATASET_FOR_EDITING,
                options: {
                    method: "post",
                    body: formData,
                },
            };

            CookieManager.prepareRequest(request);
            const response = await fetch(request.url, request.options);

            if (response.ok) {
                CookieManager.processResponse(response);
                const responseBody = (await response.json()) as RequestResult;
                console.log(responseBody.data);
            } else {
                navigate("/data");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const content = (
        <div>
            <h1>Editing Dataset with ID: {idDataset}</h1>
        </div>
    );

    return <Layout component={content} />;
}

export default DatasetEditor;
