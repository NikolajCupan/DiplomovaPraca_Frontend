export interface FetchRequest {
    url: string;
    options: RequestInit;
}

export interface RequestResult {
    message: string;
    data: any;
}

export interface DatasetInfo {
    idDataset: number;
    datasetName: string;
    columnName: string;
    rowsCount: number;
    frequencyType: string;
}

export interface Row {
    date: Date | string;
    value: string;
}

export interface DatasetForEditing {
    datasetInfo: DatasetInfo;
    rows: Row[];
}
