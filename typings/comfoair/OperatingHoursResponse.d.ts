import {
  ComfoAirPayload,
  ComfoAirResponse,
  LabeledUnitNumberValue,
} from './ComfoAirResponse';

export interface OperatingHoursResponse extends ComfoAirResponse {
  payload: OperatingHoursPayload;
}

export interface OperatingHoursPayload extends ComfoAirPayload {
  away: LabeledUnitNumberValue;
  low: LabeledUnitNumberValue;
  middle: LabeledUnitNumberValue;
  high: LabeledUnitNumberValue;

  frostProtection: LabeledUnitNumberValue;
  preHeating: LabeledUnitNumberValue;
  bypassOpen: LabeledUnitNumberValue;
  filter: LabeledUnitNumberValue;
}
