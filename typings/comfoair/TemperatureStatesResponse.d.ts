import {
  ComfoAirPayload,
  ComfoAirResponse,
  LabeledArrayValue,
  LabeledUnitNumberValue,
} from './ComfoAirResponse';

export interface TemperatureStatesResponse extends ComfoAirResponse {
  payload: TemperatureStatesPayload;
}

export interface TemperatureStatesPayload extends ComfoAirPayload {
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
