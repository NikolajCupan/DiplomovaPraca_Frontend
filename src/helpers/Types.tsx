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
    frequencyType: string;
}

export interface Row {
    date: Date;
    value: string;
}

export interface DatasetForEditing {
    datasetInfo: DatasetInfo;
    rows: Row[];
}
