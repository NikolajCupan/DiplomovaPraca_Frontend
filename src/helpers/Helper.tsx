import * as Constants from "./Constants.tsx";
import * as CookiesManager from "./CookiesManager.tsx";
import * as Type from "./Types.tsx";

export function translateFrequency(frequency: string): string {
    switch (frequency.toLowerCase()) {
        case "hourly":
            return "hodinová";
        case "daily":
            return "denná";
        case "weekly":
            return "týždenná";
        case "monthly":
            return "mesačná";
        case "quarterly":
            return "štvrťročná";
        case "yearly":
            return "ročná";
        default:
            return frequency;
    }
}

export function formatDate(date: Date | string): string {
    if (typeof date === "string") {
        date = stringToDate(date);
    }

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const hour = date.getHours().toString();

    return `${year}/${month.padStart(2, "0")}/${day.padStart(2, "0")}-${hour.padStart(2, "0")}`;
}

export function formatValue(value: string): string {
    const decimalPart = value.toString().split(".")[1];
    if (decimalPart && decimalPart.length > 4) {
        const numericValue = Number(value);
        return numericValue.toFixed(4);
    } else {
        return value;
    }
}

export function getPreviousDate(date: Date, frequency: string): Date {
    const newDate = new Date(date);

    switch (frequency.toLowerCase()) {
        case "hourly":
            newDate.setHours(newDate.getHours() - 1);
            break;
        case "daily":
            newDate.setDate(newDate.getDate() - 1);
            break;
        case "weekly":
            newDate.setDate(newDate.getDate() - 7);
            break;
        case "monthly":
            newDate.setMonth(newDate.getMonth() - 1);
            break;
        case "quarterly":
            newDate.setMonth(newDate.getMonth() - 3);
            break;
        case "yearly":
            newDate.setFullYear(newDate.getFullYear() - 1);
            break;
        default:
            throw new Error(`Invalid frequency: ${frequency}`);
    }

    return newDate;
}

export function getNextDate(date: Date, frequency: string): Date {
    const newDate = new Date(date);

    switch (frequency.toLowerCase()) {
        case "hourly":
            newDate.setHours(newDate.getHours() + 1);
            break;
        case "daily":
            newDate.setDate(newDate.getDate() + 1);
            break;
        case "weekly":
            newDate.setDate(newDate.getDate() + 7);
            break;
        case "monthly":
            newDate.setMonth(newDate.getMonth() + 1);
            break;
        case "quarterly":
            newDate.setMonth(newDate.getMonth() + 3);
            break;
        case "yearly":
            newDate.setFullYear(newDate.getFullYear() + 1);
            break;
        default:
            throw new Error(`Invalid frequency: ${frequency}`);
    }

    return newDate;
}

export function stringToDate(string: string | Date): Date {
    if (string instanceof Date) {
        return string;
    }

    const year = Number(string.substring(0, 4));
    const month = Number(string.substring(5, 7));
    const day = Number(string.substring(8, 10));
    const hour = Number(string.substring(11, 13));

    let date = new Date(new Date().toDateString());
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hour);

    return date;
}

export function timeout(delayMs: number) {
    return new Promise((res) => setTimeout(res, delayMs));
}

export function appendIfAvailable<T>(
    formData: FormData,
    name: string,
    value: T,
    available: boolean,
) {
    if (available) {
        if ((value as string).toString().trim() !== "") {
            formData.append(name, (value as string).toString().trim());
        }
    }
}

export function formatJSON(object: any): string {
    const json: Record<string, any> = JSON.parse(JSON.stringify(object));
    let result: string = "";

    let first = true;
    Object.entries(json).forEach(([key, value]) => {
        if (!first) {
            result += ";";
        }
        result += " " + key + ": " + value;

        first = false;
    });

    return result;
}

export function formatDecimalNumber(value: any): string {
    const rawString = value.toString();
    let result = rawString;

    if (rawString.includes(".")) {
        const [integerPart, decimalPart] = rawString.split(".");
        if (decimalPart.length === 1) {
            result = `${integerPart}.${decimalPart}0`;
        }
    }

    return result;
}

export function getDecimalDigitsCount(value: number): number {
    if (Math.floor(value.valueOf()) === value.valueOf()) {
        return 0;
    }

    return value.toString().split(".")[1].length || 0;
}

export function formatChartValueX(value: Date, frequencyType: string): string {
    const formattedDate = formatDate(value);

    switch (frequencyType) {
        case "hourly":
            return formattedDate;
        case "daily":
        case "weekly":
            return formattedDate.substring(0, 10);
        case "monthly":
        case "quarterly":
            return formattedDate.substring(0, 7);
        case "yearly":
            return formattedDate.substring(0, 4);
    }
    return "n/a";
}

export function stringToBoolean(value: string) {
    return value.trim().toLowerCase() === "true";
}

export async function getDatasetForViewing(
    idDataset: number,
): Promise<Type.DatasetForViewing | null> {
    const formData = new FormData();
    formData.append("idDataset", idDataset.toString());

    const request: Type.FetchRequest = {
        url: Constants.BACKEND_PATH + Constants.GET_DATASET_FOR_EDITING,
        options: {
            method: "post",
            body: formData,
        },
    };

    CookiesManager.prepareRequest(request);
    const response = await fetch(request.url, request.options);
    const responseBody = (await response.json()) as Type.RequestResult;

    if (response.ok) {
        CookiesManager.processResponse(response);

        let datasetForViewing: Type.DatasetForViewing = {
            datasetInfo: {
                idDataset: -1,
                datasetName: "",
                columnName: "",
                rowsCount: -1,
                frequencyType: "",
            },
            rows: [],
        };

        datasetForViewing.datasetInfo.idDataset =
            responseBody.data.datasetInfoDto.idDataset;
        datasetForViewing.datasetInfo.datasetName =
            responseBody.data.datasetInfoDto.datasetName;
        datasetForViewing.datasetInfo.columnName =
            responseBody.data.datasetInfoDto.columnName;
        datasetForViewing.datasetInfo.rowsCount =
            responseBody.data.datasetInfoDto.rowsCount;
        datasetForViewing.datasetInfo.frequencyType =
            responseBody.data.datasetInfoDto.frequencyType;

        const rows = responseBody.data.rows;
        for (let i = 0; i < rows.length; ++i) {
            let newRow: Type.Row = {
                date: new Date(),
                value: "",
            };

            newRow.date = rows[i].dateTime;
            newRow.value = rows[i].value;

            datasetForViewing.rows.push(newRow);
        }

        return datasetForViewing;
    } else {
        return null;
    }
}

export function transformToJson(
    datasetForViewing: Type.DatasetForViewing,
): Type.RequestResult {
    let datesArray: string[] = [];
    let valuesArray: (number | null)[] = [];
    datasetForViewing!.rows.forEach((element: Type.Row) => {
        datesArray.push(formatDate(element.date));
        valuesArray.push(!element.value ? null : Number(element.value));
    });

    let dataJson: Record<string, any> = {};
    dataJson["date"] = { result: datesArray };
    dataJson["data"] = { result: valuesArray };

    const json: Type.RequestResult = {
        message: "",
        data: JSON.stringify(dataJson),
    };

    return json;
}
