export interface ComfoAirSetResponse
{
    type: string;
}

export interface ComfoAirResponse
{
    type: string;
    valid: boolean;
    payload: ComfoAirPayload;
}

export interface ComfoAirPayload
{
    description: string;
}

export interface LabeledValue
{
    label: string;
}

export interface LabeledNumberValue extends LabeledValue
{
    value: number;
}

export interface LabeledUnitNumberValue extends LabeledNumberValue
{
    unit: string;
}

export interface LabeledStringValue extends LabeledValue
{
    value: string;
}

export interface LabeledBooleanValue extends LabeledValue
{
    value: boolean;
}

export interface LabeledArrayValue extends LabeledValue
{
    value: any[];
}