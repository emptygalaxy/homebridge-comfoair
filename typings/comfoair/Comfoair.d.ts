import {ComfoAirSetResponse} from './ComfoAirResponse';
import {BootloaderVersionResponse} from './BootloaderVersionResponse';
import {FirmwareVersionResponse} from './FirmwareVersionResponse';
import {FanStateResponse} from './FanState';
import {FlapStateResponse} from './FlapStateResponse';
import {OperatingHoursResponse} from './OperatingHoursResponse';
import {VentilationLevelResponse} from './VentilationLevelResponse';
import {TemperaturesResponse} from './TemperaturesResponse';
import {TemperatureStatesResponse} from './TemperatureStatesResponse';
import {FaultsResponse} from './FaultsResponse';
import {Command} from './Command';
// import {ComfoairConfig} from './ComfoairConfig';

export interface Comfoair {
  // new (config?: ComfoairConfig): unknown;

  on(event: string, callback: (err?: Error) => void): void;

  write(command: Command, callback: (err: Error | undefined) => void): void;

  runCommand(
    commandName: string,
    params: {[key: string]: string},
    callback: (err: Error | undefined, response?: ComfoAirSetResponse) => void
  ): void;

  setLevel(
    level: string | number,
    callback: (err: Error | undefined, response?: ComfoAirSetResponse) => void
  ): void;

  setComfortTemperature(
    temperature: number,
    callback: (err: Error | undefined, response?: ComfoAirSetResponse) => void
  ): void;

  reset(
    resetFaults: boolean,
    resetSettings: boolean,
    runSelfTest: boolean,
    resetFilterTime: boolean,
    callback: (err: Error | undefined, response?: ComfoAirSetResponse) => void
  ): void;

  getBootloaderVersion(
    callback: (
      err: Error | undefined,
      response?: BootloaderVersionResponse
    ) => void
  ): void;

  getFirmwareVersion(
    callback: (
      err: Error | undefined,
      response?: FirmwareVersionResponse
    ) => void
  ): void;

  getFanState(
    callback: (err: Error | undefined, response?: FanStateResponse) => void
  ): void;

  getFlapState(
    callback: (err: Error | undefined, response?: FlapStateResponse) => void
  ): void;

  getOperatingHours(
    callback: (
      err: Error | undefined,
      response?: OperatingHoursResponse
    ) => void
  ): void;

  getVentilationLevel(
    callback: (
      err: Error | undefined,
      response?: VentilationLevelResponse
    ) => void
  ): void;

  getTemperatures(
    callback: (err: Error | undefined, response?: TemperaturesResponse) => void
  ): void;

  getTemperatureStates(
    callback: (
      err: Error | undefined,
      response?: TemperatureStatesResponse
    ) => void
  ): void;

  getFaults(
    callback: (err: Error | undefined, response?: FaultsResponse) => void
  ): void;
}
