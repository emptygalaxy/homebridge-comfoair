import {ComfoAirPayload, ComfoAirResponse, LabeledArrayValue, LabeledUnitNumberValue} from './ComfoAirResponse';

export interface TemperaturesResponse extends ComfoAirResponse
{
    payload: TemperaturesPayload;
}

export interface TemperaturesPayload extends ComfoAirPayload
{
    comfort: LabeledUnitNumberValue;
    outsideAir: LabeledUnitNumberValue;
    supplyAir: LabeledUnitNumberValue;
    outgoingAir: LabeledUnitNumberValue;
    exhaustAir: LabeledUnitNumberValue;
    sensorConnected: LabeledArrayValue;
    groundHeatExchanger: LabeledUnitNumberValue;
    preheating: LabeledUnitNumberValue;
    cookerHood: LabeledUnitNumberValue;
}