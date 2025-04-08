import * as Helper from "../../../../helpers/Helper.tsx";
import * as Type from "../../../../helpers/Types.tsx";

import { TableContainer } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface AccuracyTableProps {
    responseBody: Type.RequestResult | null;
    trainJsonKey: string;
    testJsonKey: string;

    customStyle?: React.CSSProperties;
}

function AccuracyTable(props: AccuracyTableProps) {
    if (!props.responseBody) {
        return;
    }

    const responseBodyData: Record<string, any> = JSON.parse(
        props.responseBody.data,
    );

    const trainJson: Record<string, any> = responseBodyData[props.trainJsonKey];
    const testJson: Record<string, any> =
        props.testJsonKey in responseBodyData
            ? responseBodyData[props.testJsonKey]
            : {};

    return (
        <TableContainer style={{ ...props.customStyle }}>
            <Table sx={{ minWidth: 350 }}>
                <colgroup>
                    <col style={{ width: "33%" }} />
                    <col style={{ width: "33%" }} />
                    <col style={{ width: "33%" }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Metrika</TableCell>
                        <TableCell>Množina</TableCell>
                        <TableCell align="right">Hodnota</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(trainJson).map(([key, value]) => (
                        <TableRow key={key + "_train"}>
                            <TableCell>{key.toUpperCase()}</TableCell>
                            <TableCell>Train</TableCell>
                            <TableCell align="right">
                                {Helper.formatNumericValue(value)}
                            </TableCell>
                        </TableRow>
                    ))}
                    {Object.entries(testJson).map(([key, value]) => (
                        <TableRow key={key + "_test"}>
                            <TableCell>{key.toUpperCase()}</TableCell>
                            <TableCell>Test</TableCell>
                            <TableCell align="right">
                                {Helper.formatNumericValue(value)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AccuracyTable;
