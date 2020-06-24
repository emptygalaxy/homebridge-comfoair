import {
    ComfoAirPayload,
    ComfoAirResponse,
    LabeledBooleanValue,
    LabeledNumberValue,
    LabeledUnitNumberValue
} from "./ComfoAirResponse";

export interface VentilationLevelResponse extends ComfoAirResponse
{
    payload: VentilationLevelPayload;
}

export interface VentilationLevelPayload extends ComfoAirPayload
{
    exhaustAway: LabeledUnitNumberValue;
    exhaustLow: LabeledUnitNumberValue;
    exhaustMiddle: LabeledUnitNumberValue;
    supplyAway: LabeledUnitNumberValue;
    supplyLow: LabeledUnitNumberValue;
    supplyMiddle: LabeledUnitNumberValue;
    exhaustCurrent: LabeledUnitNumberValue;
    supplyCurrent: LabeledUnitNumberValue;
    currentLevel: LabeledNumberValue;
    supplyFanRunning: LabeledBooleanValue;
    exhaustHigh: LabeledUnitNumberValue;
    supplyHigh: LabeledUnitNumberValue;
}