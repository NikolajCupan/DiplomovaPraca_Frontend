import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";
import "../../../index.css";
import LineChartWrapper from "../../common/elements/charts/LineChartWrapper.tsx";
import ScrollableContainer from "../../common/elements/ScrollableContainer.tsx";
import Layout from "../../layout/Layout.tsx";
import DatasetViewerForm from "./DatasetViewerForm.tsx";

import * as React from "react";

function DatasetViewer() {
    const [datasetForViewing, setDatasetForViewing] =
        React.useState<Type.DatasetForViewing | null>(null);

    const getResultContent = () => {
        if (datasetForViewing) {
            return getChartContent();
        } else {
            return <div className="inner-container-style">Zvoľte dataset</div>;
        }
    };

    const getChartContent = () => {
        let datesArray: string[] = [];
        let valuesArray: (number | null)[] = [];
        datasetForViewing!.rows.forEach((element: Type.Row) => {
            datesArray.push(Helper.formatDate(element.date));
            valuesArray.push(!element.value ? null : Number(element.value));
        });

        let dataJson: Record<string, any> = {};
        dataJson["date"] = { result: datesArray };
        dataJson["data"] = { result: valuesArray };

        const json: Type.RequestResult = {
            message: "",
            data: JSON.stringify(dataJson),
        };

        return (
            <ScrollableContainer
                breakpointWidth={Constants.DEFAULT_BREAKPOINT_WIDTH}
            >
                <LineChartWrapper
                    label={"Dáta"}
                    yAxisArrayKey={"data"}
                    xAxisArrayKey={"date"}
                    responseBody={json}
                    height={Constants.DEFAULT_CHART_HEIGHT}
                    isXAxisDate={true}
                    frequency={datasetForViewing!.datasetInfo.frequencyType}
                />
            </ScrollableContainer>
        );
    };

    const content = (
        <>
            <div className="custom-container">
                <DatasetViewerForm
                    datasetForViewing={datasetForViewing}
                    setDatasetForViewing={setDatasetForViewing}
                />
            </div>

            <div className="custom-container">{getResultContent()}</div>
        </>
    );

    return <Layout component={content} />;
}

export default DatasetViewer;
