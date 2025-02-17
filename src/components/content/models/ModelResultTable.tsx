import * as Constants from "../../../helpers/Constants.tsx";
import * as Helper from "../../../helpers/Helper.tsx";
import * as Type from "../../../helpers/Types.tsx";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import * as React from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";

interface ModelResultTableProps {
    responseBody: Type.RequestResult | null;
}

function ModelResultTable(props: ModelResultTableProps) {
    const [tableData, setTableData] = React.useState<Record<string, any>[]>([]);

    React.useEffect(() => {
        setTableData([]);

        if (!props.responseBody) {
            return;
        }

        const responseBodyData: Record<string, any> = JSON.parse(
            props.responseBody.data,
        );

        const train: Record<string, any> =
            responseBodyData[Constants.TRAIN_KEY];
        const trainLength = train["date"].length;

        const test: Record<string, any> =
            Constants.TEST_KEY in responseBodyData
                ? responseBodyData[Constants.TEST_KEY]
                : {};
        const testLength = "date" in test ? test["date"].length : 0;

        const forecast: Record<string, any> =
            responseBodyData[Constants.FORECAST_KEY];
        const forecastLength = forecast["date"].length;

        const newTableData: Record<string, any>[] = [];
        for (let i = 0; i < trainLength; ++i) {
            const row: Record<string, any> = {};
            row[Constants.MODEL_DATE_KEY] = train[Constants.MODEL_DATE_KEY][i];
            row["type"] = "Train";
            row[Constants.MODEL_REAL_KEY] = train[Constants.MODEL_REAL_KEY][i];
            row[Constants.MODEL_FITTED_KEY] =
                train[Constants.MODEL_FITTED_KEY][i];
            row[Constants.MODEL_RESIDUALS_KEY] =
                train[Constants.MODEL_RESIDUALS_KEY][i];

            newTableData.push(row);
        }

        for (let i = 0; i < testLength; ++i) {
            const row: Record<string, any> = {};
            row[Constants.MODEL_DATE_KEY] = test[Constants.MODEL_DATE_KEY][i];
            row["type"] = "Test";
            row[Constants.MODEL_REAL_KEY] = test[Constants.MODEL_REAL_KEY][i];
            row[Constants.MODEL_FITTED_KEY] =
                test[Constants.MODEL_FITTED_KEY][i];
            row[Constants.MODEL_RESIDUALS_KEY] =
                test[Constants.MODEL_RESIDUALS_KEY][i];

            newTableData.push(row);
        }

        for (let i = trainLength + testLength; i < forecastLength; ++i) {
            const row: Record<string, any> = {};
            row[Constants.MODEL_DATE_KEY] =
                forecast[Constants.MODEL_DATE_KEY][i];
            row["type"] = "Predikcia";
            row[Constants.MODEL_REAL_KEY] = "-";
            row[Constants.MODEL_FITTED_KEY] =
                forecast[Constants.MODEL_FITTED_KEY][i];
            row[Constants.MODEL_RESIDUALS_KEY] = "-";

            newTableData.push(row);
        }

        setTableData(newTableData);
    }, [props.responseBody]);

    interface ColumnData {
        label: string;
        dataKey: string;
        minWidthPx: number;
        isNumeric: boolean;
    }

    const columns: ColumnData[] = [
        {
            label: "Dátum (YYYY/MM/DD-HH)",
            dataKey: Constants.MODEL_DATE_KEY,
            minWidthPx: 200,
            isNumeric: false,
        },
        {
            label: "Množina",
            dataKey: "type",
            minWidthPx: 100,
            isNumeric: false,
        },
        {
            label: "Skutočnosť",
            dataKey: Constants.MODEL_REAL_KEY,
            minWidthPx: 100,
            isNumeric: true,
        },
        {
            label: "Predikcia",
            dataKey: Constants.MODEL_FITTED_KEY,
            minWidthPx: 100,
            isNumeric: true,
        },
        {
            label: "Reziduum",
            dataKey: Constants.MODEL_RESIDUALS_KEY,
            minWidthPx: 100,
            isNumeric: true,
        },
    ];

    const formatTableCellValue = (
        column: ColumnData,
        value: Record<string, any>,
    ) => {
        const data: string = value[column.dataKey];
        if (!column.isNumeric) {
            return data;
        }

        const numericData: number = Number(data);
        const decimalDigitsCount = Helper.getDecimalDigitsCount(numericData);

        if (decimalDigitsCount > 5) {
            return numericData.toFixed(3);
        } else {
            return numericData;
        }
    };

    function fixedHeaderContent() {
        return (
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        variant="head"
                        sx={{
                            backgroundColor: "background.paper",
                            width: column.minWidthPx + "px",
                            minWidth: column.minWidthPx + "px",
                        }}
                    >
                        {column.label}
                    </TableCell>
                ))}
            </TableRow>
        );
    }

    function rowContent(_index: number, row: Record<string, any>) {
        return (
            <React.Fragment>
                {columns.map((column) => (
                    <TableCell key={column.dataKey}>
                        {formatTableCellValue(column, row)}
                    </TableCell>
                ))}
            </React.Fragment>
        );
    }

    const VirtuosoTableComponents: TableComponents<Record<string, any>> = {
        Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
            <TableContainer
                sx={{ marginBottom: "20px" }}
                {...props}
                ref={ref}
            />
        )),
        Table: (props) => <Table {...props} />,
        TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
            <TableHead {...props} ref={ref} />
        )),
        TableRow,
        TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
            <TableBody {...props} ref={ref} />
        )),
    };

    return (
        <TableVirtuoso
            data={tableData}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
            style={{ height: 500 }}
        />
    );
}

export default ModelResultTable;
