import {
  LabeledBooleanValue,
  LabeledNumberValue,
  LabeledStringValue,
} from './ComfoAirResponse';

export interface FaultsResponse {
  currentErrorA: LabeledStringValue;
  currentErrorE: LabeledNumberValue;

  lastErrorA: LabeledStringValue;
  lastErrorE: LabeledNumberValue;

  penultimateErrorA: LabeledStringValue;
  penultimateErrorE: LabeledNumberValue;
  antepenultimateErrorA: LabeledStringValue;
  antepenultimateErrorE: LabeledNumberValue;

  replaceFilter: LabeledBooleanValue;

  currentErrorEA: LabeledNumberValue;
  lastErrorEA: LabeledNumberValue;
  penultimateErrorEA: LabeledNumberValue;
  antepenultimateErrorEA: LabeledNumberValue;
  currentErrorAHigh: LabeledNumberValue;
  lastErrorAHigh: LabeledNumberValue;
  penultimateErrorAHigh: LabeledNumberValue;
  antepenultimateErrorAHigh: LabeledNumberValue;

  description: string;
  type: string;
}
