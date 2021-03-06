import {ComfoAirPayload, ComfoAirResponse, LabeledUnitNumberValue} from './ComfoAirResponse';

export interface FlapStateResponse extends ComfoAirResponse
{
    payload: FlapStatePayload;
}

export interface FlapStatePayload extends ComfoAirPayload
{
    bypass: LabeledUnitNumberValue;
    preheat: LabeledUnitNumberValue;
    bypassMotorCurrent: LabeledUnitNumberValue;
    preheatMotorCurrent: LabeledUnitNumberValue;
}
