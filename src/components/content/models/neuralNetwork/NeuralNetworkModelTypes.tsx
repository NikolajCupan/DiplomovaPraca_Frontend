export interface Layer {}

export interface HiddenLayer extends Layer {
    activationFunction: string;
    activationFunctionParameters: Record<string, string>;
    neuronsCount: number;
    biasesRegularizerL1: number;
    biasesRegularizerL2: number;
    weightsRegularizerL1: number;
    weightsRegularizerL2: number;
}

export interface DropoutLayer extends Layer {
    keepRate: number;
}
