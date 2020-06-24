import {ComfoAirPayload, ComfoAirResponse, LabeledNumberValue, LabeledStringValue} from './ComfoAirResponse';

export interface FirmwareVersionResponse extends ComfoAirResponse
{
    payload: FirmwareVersionPayload;
}

export interface FirmwareVersionPayload extends ComfoAirPayload
{
    major: LabeledNumberValue;
    minor: LabeledNumberValue;
    beta: LabeledNumberValue;
    deviceName: LabeledStringValue;
}