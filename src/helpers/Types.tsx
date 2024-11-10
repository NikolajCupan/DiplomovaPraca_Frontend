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
    frequencyType: string;
}
