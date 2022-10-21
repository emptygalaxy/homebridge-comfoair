import {
  ComfoAirPayload,
  ComfoAirResponse,
  LabeledStringValue,
  LabeledUnitNumberValue,
} from './ComfoAirResponse';

export interface FlapStateResponse extends ComfoAirResponse {
  payload: FlapStatePayload;
}

export interface FlapStatePayload extends ComfoAirPayload {
  bypass: LabeledUnitNumberValue;
  preheat: LabeledStringValue;
  bypassMotorCurrent: LabeledUnitNumberValue;
  preheatMotorCurrent: LabeledUnitNumberValue;
}
