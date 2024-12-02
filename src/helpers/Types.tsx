export interface FetchRequest {
    url: string;
    options: RequestInit;
}

export interface RequestResult {
    message: string;
    data: any;
}

export interface DatasetForEditing {
    datasetInfo: DatasetInfo;
    rows: [Date, number][];
}

export interface DatasetInfo {
    idDataset: number;
    datasetName: string;
    frequencyType: string;
}
