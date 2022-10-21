import {ServiceHandler} from './ServiceHandler';
import type {Service, CharacteristicGetCallback, Logger, API} from 'homebridge';
import {CharacteristicEventTypes} from 'homebridge';
import {ComfoAirAccessory} from './ComfoAirAccessory';
import {ComfoAirState} from './ComfoAirState';

export class OutsideTemperatureHandler implements ServiceHandler {
  private readonly _log: Logger;
  private readonly _api: API;
  private readonly _accessory: ComfoAirAccessory;

  private readonly _info: boolean = true;

  // Services
  private readonly _temperatureSensorService: Service;

  constructor(log: Logger, api: API, accessory: ComfoAirAccessory) {
    this._log = log;
    this._api = api;
    this._accessory = accessory;

    this._temperatureSensorService = this.createService();
  }

  createService(): Service {
    const Characteristic = this._api.hap.Characteristic;
    const Service = this._api.hap.Service;

    const temperatureSensorService = new Service.TemperatureSensor();
    temperatureSensorService.setCharacteristic(
      Characteristic.Name,
      'Outside temperature'
    );

    temperatureSensorService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on(
        CharacteristicEventTypes.GET,
        this.getCurrentOutsideTemperature.bind(this)
      );

    return temperatureSensorService;
  }

  public handleState(state: ComfoAirState): void {
    const Characteristic = this._api.hap.Characteristic;
    const currentTemperature: number = ComfoAirAccessory.round(
      state.outsideTemperature,
      2
    );
    this._temperatureSensorService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .updateValue(currentTemperature);
  }

  public getService(): Service {
    return this._temperatureSensorService;
  }

  getCurrentOutsideTemperature(callback: CharacteristicGetCallback): void {
    this._log.info('get current outside temperature');

    this._accessory.refreshTemperatureState(
      (state: ComfoAirState, error?: Error) => {
        if (this._info) {
          this._log.info(
            'refreshTemperatureState callback',
            error,
            state.outsideTemperature
          );
        }

        callback(error, state.outsideTemperature);
      }
    );
  }
}
