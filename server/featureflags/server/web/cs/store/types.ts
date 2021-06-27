export interface IDeleteCheckPayload {
    flagId: string;
    conditionId: string;
    checkId: string;
}

export interface ISetEnabledPayload {
    flagId: string;
    value: boolean;
}

export interface ISetVariablePayload {
    flagId: string;
    conditionId: string;
    checkId: string;
    variableId: string;
}

export interface ISetOperatorPayload {
    flagId: string;
    conditionId: string;
    checkId: string;
    value: number;
}

export interface ISetValue {
    flagId: string;
    conditionId: string;
    checkId: string;
}

export interface ISetValueString extends ISetValue {
    value?: string;
}

export interface ISetValueNumber extends ISetValue {
    value?: number;
}

export interface ISetValueTimestamp extends ISetValue {
    value?: number;
}

export interface ISetValueSet extends ISetValue {
    value?: string[];
}

export interface ISearchResult {
    id: string,
    name: string
}
