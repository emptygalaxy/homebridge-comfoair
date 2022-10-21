import {ServiceHandler} from './ServiceHandler';
import type {
  Service,
  CharacteristicValue,
  CharacteristicSetCallback,
  CharacteristicGetCallback,
  Logger,
  API,
} from 'homebridge';
import {CharacteristicEventTypes} from 'homebridge';
import {ComfoAirAccessory} from './ComfoAirAccessory';
import {ComfoAirState} from './ComfoAirState';

export class FilterHandler implements ServiceHandler {
  private readonly _log: Logger;
  private readonly _api: API;
  private readonly _accessory: ComfoAirAccessory;

  private readonly _info: boolean = true;

  private readonly _maxFilterOperatingHours: number;

  // Services
  private readonly _filterService: Service;

  constructor(
    log: Logger,
    api: API,
    accessory: ComfoAirAccessory,
    maxFilterOperatingHours: number
  ) {
    this._log = log;
    this._api = api;
    this._accessory = accessory;
    this._maxFilterOperatingHours = maxFilterOperatingHours;

    this._filterService = this.createService();
  }

  private createService(): Service {
    const Characteristic = this._api.hap.Characteristic;
    const Service = this._api.hap.Service;

    const filterService = new Service.FilterMaintenance();

    filterService.setCharacteristic(Characteristic.Name, 'Filter');
    filterService
      .getCharacteristic(Characteristic.FilterLifeLevel)
      .on(CharacteristicEventTypes.GET, this.getFilterLifeLevel.bind(this));
    filterService
      .getCharacteristic(Characteristic.FilterChangeIndication)
      .on(
        CharacteristicEventTypes.GET,
        this.getFilterChangeIndication.bind(this)
      );
    filterService
      .getCharacteristic(Characteristic.ResetFilterIndication)
      .on(
        CharacteristicEventTypes.SET,
        this.setResetFilterIndication.bind(this)
      );

    return filterService;
  }

  public handleState(state: ComfoAirState): void {
    const Characteristic = this._api.hap.Characteristic;
    // update Characteristics
    const filterChange = state.replaceFilter
      ? Characteristic.FilterChangeIndication.CHANGE_FILTER
      : Characteristic.FilterChangeIndication.FILTER_OK;
    this._filterService
      .getCharacteristic(Characteristic.FilterChangeIndication)
      .updateValue(filterChange);

    const filterLifeLevel = FilterHandler.calculateFilterLifeLevel(
      state,
      this._maxFilterOperatingHours
    );

    this._filterService
      .getCharacteristic(Characteristic.FilterLifeLevel)
      .updateValue(filterLifeLevel);
  }

  public getService(): Service {
    return this._filterService;
  }

  private getFilterLifeLevel(callback: CharacteristicGetCallback) {
    this._log.info('get filter life level');

    this._accessory.refreshFilterState(
      (state: ComfoAirState, error?: Error) => {
        if (this._info) {
          this._log.info(
            'refreshFilterState callback',
            error,
            state.filterOperatingHours
          );
        }

        const filterLifeLevel = FilterHandler.calculateFilterLifeLevel(
          state,
          this._maxFilterOperatingHours
        );
        callback(error, filterLifeLevel);
      }
    );
  }

  private static calculateFilterLifeLevel(
    state: {filterOperatingHours: number},
    maxFilterOperatingHours: number
  ): CharacteristicValue {
    return Math.min(
      100,
      Math.round((state.filterOperatingHours / maxFilterOperatingHours) * 100)
    );
  }

  private getFilterChangeIndication(callback: CharacteristicGetCallback) {
    const Characteristic = this._api.hap.Characteristic;

    this._log.info('get filter change indication');

    this._accessory.refreshFaults((state: ComfoAirState, error?: Error) => {
      if (this._info) {
        this._log.info('refreshFaults callback', error, state.replaceFilter);
      }

      const filterChange: CharacteristicValue = state.replaceFilter
        ? Characteristic.FilterChangeIndication.CHANGE_FILTER
        : Characteristic.FilterChangeIndication.FILTER_OK;
      callback(error, filterChange);
    });
  }

  private setResetFilterIndication(
    value: CharacteristicValue,
    callback: CharacteristicSetCallback
  ) {
    this._log.info('reset filter life level', value);

    this._accessory.resetFilter((state: ComfoAirState, error?: Error) => {
      if (this._info) {
        this._log.info('reset confirmed');
      }

      callback(error);
    });
  }
}
