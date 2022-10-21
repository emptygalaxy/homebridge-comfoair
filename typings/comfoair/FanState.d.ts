import {
  ComfoAirPayload,
  ComfoAirResponse,
  LabeledUnitNumberValue,
} from './ComfoAirResponse';

export interface FanStateResponse extends ComfoAirResponse {
  payload: FanStatePayload;
}

export interface FanStatePayload extends ComfoAirPayload {
  supplyAir: LabeledUnitNumberValue;
  outgoingAir: LabeledUnitNumberValue;
  rotationsSupply: LabeledUnitNumberValue;
  rotationsOutgoing: LabeledUnitNumberValue;
}
