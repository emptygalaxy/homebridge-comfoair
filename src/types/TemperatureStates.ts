import {ComfoAirPayload, ComfoAirResponse, LabeledUnitNumberValue} from './ComfoAirResponse';

export interface TemperatureStatesResponse extends ComfoAirResponse
{
    payload: TemperatureStatesPayload;
}

export interface TemperatureStatesPayload extends ComfoAirPayload
{
    outsideAir: LabeledUnitNumberValue;
    supplyAir: LabeledUnitNumberValue;
    outgoingAir: LabeledUnitNumberValue;
    exhaustAir: LabeledUnitNumberValue;
}