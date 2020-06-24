import {ComfoAirPayload, ComfoAirResponse, LabeledNumberValue, LabeledStringValue} from './ComfoAirResponse';

export interface BootloaderVersionResponse extends ComfoAirResponse
{
    payload: BootloaderVersionPayload;
}

export interface BootloaderVersionPayload extends ComfoAirPayload
{
    major: LabeledNumberValue;
    minor: LabeledNumberValue;
    beta: LabeledNumberValue;
    deviceName: LabeledStringValue;
}