import {Comfoair} from '../typings/comfoair/Comfoair';
import {BootloaderVersionResponse} from '../typings/comfoair/BootloaderVersionResponse';
import {FanStateResponse} from '../typings/comfoair/FanState';
import {TemperatureStatesResponse} from '../typings/comfoair/TemperatureStatesResponse';
import {OperatingHoursResponse} from '../typings/comfoair/OperatingHoursResponse';
import {Command} from '../typings/comfoair/Command';
import {ComfoAirSetResponse} from '../typings/comfoair/ComfoAirResponse';
import {VentilationLevelResponse} from '../typings/comfoair/VentilationLevelResponse';
import {FirmwareVersionResponse} from '../typings/comfoair/FirmwareVersionResponse';
import {TemperaturesResponse} from '../typings/comfoair/TemperaturesResponse';
import {FaultsResponse} from '../typings/comfoair/FaultsResponse';
import {FlapStateResponse} from '../typings/comfoair/FlapStateResponse';
import {ComfoairConfig} from '../typings/comfoair/ComfoairConfig';

export class DemoComfoair implements Comfoair {
  constructor(config?: ComfoairConfig, private readonly demoErrors = false) {
    console.log('Initializing demo', config);
  }

  getBootloaderVersion(
    callback: (
      err: Error | undefined,
      response?: BootloaderVersionResponse
    ) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'RES',
        valid: true,
        payload: {
          description: 'Bootloader version',
          major: {
            value: 3,
            label: 'Version Major',
          },
          minor: {
            value: 60,
            label: 'Version Minor',
          },
          beta: {
            value: 32,
            label: 'Beta',
          },
          deviceName: {
            value: 'CA350 luxe',
            label: 'Device name',
          },
        },
      });
  }

  getFanState(
    callback: (err: Error | undefined, response?: FanStateResponse) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'RES',
        valid: true,
        payload: {
          description: 'Fan state',
          supplyAir: {
            value: 35,
            label: 'Supply air',
            unit: '%',
          },
          outgoingAir: {
            value: 35,
            label: 'Outgoing air',
            unit: '%',
          },
          rotationsSupply: {
            value: 1138,
            label: 'Rotations supply',
            unit: 'rpm',
          },
          rotationsOutgoing: {
            value: 1120,
            label: 'Rotations outgoing',
            unit: 'rpm',
          },
        },
      });
  }

  getFaults(
    callback: (err: Error | undefined, response?: FaultsResponse) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        description: 'Operating faults',
        currentErrorA: {
          value: 'A0',
          label: 'current error A',
        },
        currentErrorE: {
          value: 0,
          label: 'current error E',
        },
        lastErrorA: {
          value: 'A0',
          label: 'last error A',
        },
        lastErrorE: {
          value: 0,
          label: 'last error E',
        },
        penultimateErrorA: {
          value: 'A0',
          label: 'penultimate error A',
        },
        penultimateErrorE: {
          value: 0,
          label: 'penultimate error E',
        },
        antepenultimateErrorA: {
          value: 'A0',
          label: 'antepenultimate error A',
        },
        antepenultimateErrorE: {
          value: 0,
          label: 'antepenultimate error E',
        },
        replaceFilter: {
          value: true,
          label: 'replace filter',
        },
        currentErrorEA: {
          value: 0,
          label: 'current error EA',
        },
        lastErrorEA: {
          value: 0,
          label: 'last error EA',
        },
        penultimateErrorEA: {
          value: 0,
          label: 'penultimate error EA',
        },
        antepenultimateErrorEA: {
          value: 0,
          label: 'antepenultimate error EA',
        },
        currentErrorAHigh: {
          value: 0,
          label: 'current error A high',
        },
        lastErrorAHigh: {
          value: 0,
          label: 'last error A high',
        },
        penultimateErrorAHigh: {
          value: 0,
          label: 'penultimate error A high',
        },
        antepenultimateErrorAHigh: {
          value: 0,
          label: 'antepenultimate error A high',
        },
        type: 'RES',
      });
  }

  getFirmwareVersion(
    callback: (
      err: Error | undefined,
      response?: FirmwareVersionResponse
    ) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'RES',
        valid: true,
        payload: {
          description: 'Firmware version',
          major: {
            value: 3,
            label: 'Version Major',
          },
          minor: {
            value: 60,
            label: 'Version Minor',
          },
          beta: {
            value: 32,
            label: 'Beta',
          },
          deviceName: {
            value: 'CA350 luxe',
            label: 'Device name',
          },
        },
      });
  }

  getFlapState(
    callback: (err: Error | undefined, response?: FlapStateResponse) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'RES',
        valid: true,
        payload: {
          description: 'Flap state',
          bypass: {
            value: 0,
            label: 'Bypass',
            unit: '%',
          },
          preheat: {
            value: 'Unknown',
            label: 'Preheat',
          },
          bypassMotorCurrent: {
            value: 0,
            label: 'Bypass Motor Current',
            unit: 'A',
          },
          preheatMotorCurrent: {
            value: 0,
            label: 'Preheat Motor Current',
            unit: 'A',
          },
        },
      });
  }

  getOperatingHours(
    callback: (
      err: Error | undefined,
      response?: OperatingHoursResponse
    ) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'RES',
        valid: true,
        payload: {
          description: 'Operating hours',
          away: {
            value: 13492,
            label: 'away',
            unit: 'h',
          },
          low: {
            value: 12833,
            label: 'low',
            unit: 'h',
          },
          middle: {
            value: 7699,
            label: 'middle',
            unit: 'h',
          },
          frostProtection: {
            value: 662,
            label: 'frost protection',
            unit: 'h',
          },
          preHeating: {
            value: 0,
            label: 'preheating',
            unit: 'h',
          },
          bypassOpen: {
            value: 10008,
            label: 'bypass open',
            unit: 'h',
          },
          filter: {
            value: 1825,
            label: 'filter',
            unit: 'h',
          },
          high: {
            value: 1068,
            label: 'high',
            unit: 'h',
          },
        },
      });
  }

  getTemperatureStates(
    callback: (
      err: Error | undefined,
      response?: TemperatureStatesResponse
    ) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'RES',
        valid: true,
        payload: {
          description: 'Temperatures',
          comfort: {
            value: 21,
            label: 'comfort',
            unit: '°C',
          },
          outsideAir: {
            value: 11,
            label: 'outside air',
            unit: '°C',
          },
          supplyAir: {
            value: 20.5,
            label: 'supply air',
            unit: '°C',
          },
          outgoingAir: {
            value: 19.5,
            label: 'outgoing air',
            unit: '°C',
          },
          exhaustAir: {
            value: 11.5,
            label: 'exhaust air',
            unit: '°C',
          },
          sensorConnected: {
            value: [],
            label: 'sensor connected',
          },
          groundHeatExchanger: {
            value: 0,
            label: 'ground heat exchanger',
            unit: '°C',
          },
          preheating: {
            value: 0,
            label: 'preheating',
            unit: '°C',
          },
          cookerHood: {
            value: 0,
            label: 'cooker hood',
            unit: '°C',
          },
        },
      });
  }

  getTemperatures(
    callback: (err: Error | undefined, response?: TemperaturesResponse) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'RES',
        valid: true,
        payload: {
          description: 'Temperatures',
          comfort: {
            value: 21,
            label: 'comfort',
            unit: '°C',
          },
          outsideAir: {
            value: 11,
            label: 'outside air',
            unit: '°C',
          },
          supplyAir: {
            value: 20.5,
            label: 'supply air',
            unit: '°C',
          },
          outgoingAir: {
            value: 19.5,
            label: 'outgoing air',
            unit: '°C',
          },
          exhaustAir: {
            value: 11.5,
            label: 'exhaust air',
            unit: '°C',
          },
          sensorConnected: {
            value: [],
            label: 'sensor connected',
          },
          groundHeatExchanger: {
            value: 0,
            label: 'ground heat exchanger',
            unit: '°C',
          },
          preheating: {
            value: 0,
            label: 'preheating',
            unit: '°C',
          },
          cookerHood: {
            value: 0,
            label: 'cooker hood',
            unit: '°C',
          },
        },
      });
  }

  getVentilationLevel(
    callback: (
      err: Error | undefined,
      response?: VentilationLevelResponse
    ) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'RES',
        valid: true,
        payload: {
          description: 'Get ventilation levels',
          exhaustAway: {
            value: 15,
            label: 'Exhaust fan level away',
            unit: '%',
          },
          exhaustLow: {
            value: 35,
            label: 'Exhaust fan level low',
            unit: '%',
          },
          exhaustMiddle: {
            value: 50,
            label: 'Exhaust fan level middle',
            unit: '%',
          },
          supplyAway: {
            value: 15,
            label: 'Supply fan level away',
            unit: '%',
          },
          supplyLow: {
            value: 35,
            label: 'Supply fan level low',
            unit: '%',
          },
          supplyMiddle: {
            value: 50,
            label: 'Supply fan level middle',
            unit: '%',
          },
          exhaustCurrent: {
            value: 15,
            label: 'Current exhaust fan level',
            unit: '%',
          },
          supplyCurrent: {
            value: 15,
            label: 'Current supply fan level',
            unit: '%',
          },
          currentLevel: {
            value: 1,
            label: 'Current ventilation level',
          },
          supplyFanRunning: {
            value: true,
            label: 'Supply fan is running',
          },
          exhaustHigh: {
            value: 70,
            label: 'Exhaust fan level high',
            unit: '%',
          },
          supplyHigh: {
            value: 70,
            label: 'Exhaust fan level high',
            unit: '%',
          },
        },
      });
  }

  on(event: string, callback: (err?: Error) => void): void {
    callback(new Error('this is a demo error'));
  }

  reset(
    resetFaults: boolean,
    resetSettings: boolean,
    runSelfTest: boolean,
    resetFilterTime: boolean,
    callback: (err: Error | undefined, response?: ComfoAirSetResponse) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'ACK',
      });
  }

  runCommand(
    commandName: string,
    params: {[p: string]: string},
    callback: (err: Error | undefined, response?: ComfoAirSetResponse) => void
  ): void {
    callback(new Error('this is a demo error'));
  }

  setComfortTemperature(
    temperature: number,
    callback: (err: Error | undefined, response?: ComfoAirSetResponse) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'ACK',
      });
  }

  setLevel(
    level: string | number,
    callback: (err: Error | undefined, response?: ComfoAirSetResponse) => void
  ): void {
    if (this.demoErrors) callback(new Error('this is a demo error'));
    else
      callback(undefined, {
        type: 'ACK',
      });
  }

  write(command: Command, callback: (err: Error | undefined) => void): void {
    callback(new Error('this is a demo error'));
  }
}
