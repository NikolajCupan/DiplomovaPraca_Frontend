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

interface DatasetViewerTableProps {
    selectedDatasetInfo: Type.DatasetInfo;
    datasetForViewing: Type.DatasetForViewing;
}

function DatasetViewerTable(props: DatasetViewerTableProps) {
    interface ColumnData {
        label: string;
        dataKey: keyof Type.Row;
        widthPercent: number;
        minWidthPx: number;
        alignLeft: boolean;
        isDate: boolean;
    }

    const columns: ColumnData[] = [
        {
            label: "Dátum (YYYY/MM/DD-HH)",
            dataKey: "date",
            widthPercent: 50,
            minWidthPx: 200,
            alignLeft: true,
            isDate: true,
        },
        {
            label: props.selectedDatasetInfo.columnName,
            dataKey: "value",
            widthPercent: 50,
            minWidthPx: 200,
            alignLeft: false,
            isDate: false,
        },
    ];

    function fixedHeaderContent() {
        return (
            <TableRow>
                {columns.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        variant="head"
                        align={column.alignLeft ? "left" : "right"}
                        sx={{
                            backgroundColor: "background.paper",
                            width: column.widthPercent + "%",
                            minWidth: column.minWidthPx + "px",
                        }}
                    >
                        {column.label}
                    </TableCell>
                ))}
            </TableRow>
        );
    }

    function rowContent(_index: number, row: Type.Row) {
        return (
            <React.Fragment>
                {columns.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        align={column.alignLeft ? "left" : "right"}
                    >
                        {column.isDate
                            ? Helper.formatDate(row[column.dataKey])
                            : Helper.formatValue(row[column.dataKey] as string)}
                    </TableCell>
                ))}
            </React.Fragment>
        );
    }

    const VirtuosoTableComponents: TableComponents<Type.Row> = {
        Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
            <TableContainer
                sx={{ marginTop: "20px", marginBottom: "20px" }}
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
            data={props.datasetForViewing.rows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
            style={{ height: 500 }}
        />
    );
}

export default DatasetViewerTable;
