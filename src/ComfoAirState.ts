import {VentilationLevel} from './VentilationLevel';

export interface ComfoAirState {
  power: boolean;
  level: VentilationLevel;
  targetTemperature: number;
  insideTemperature: number;
  outsideTemperature: number;
  filterOperatingHours: number;
  replaceFilter: boolean;
}
