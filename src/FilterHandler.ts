import {ServiceHandler} from "./ServiceHandler";
import {
    Characteristic,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    CharacteristicSetCallback, CharacteristicValue,
    Service
} from "hap-nodejs";
import {ComfoAirAccessory} from "./ComfoAirAccessory";
import {ComfoAirState} from "./ComfoAirState";
import {Logger} from "homebridge/lib/logger";
import {API} from "homebridge/lib/api";

export class FilterHandler implements ServiceHandler
{
    private readonly _log: Logger;
    private readonly _api: API;
    private readonly _accessory: ComfoAirAccessory;

    private readonly _info: boolean = true;

    private readonly _maxFilterOperatingHours: number;

    // Services
    private readonly _filterService: Service;

    constructor(log: Logger, api: API, accessory: ComfoAirAccessory, maxFilterOperatingHours: number)
    {
        this._log = log;
        this._api = api;
        this._accessory = accessory;
        this._maxFilterOperatingHours = maxFilterOperatingHours;

        this._filterService = this.createService();
    }

    private createService(): Service
    {
        let filterService = new this._api.hap.Service.FilterMaintenance();

        filterService.setCharacteristic(Characteristic.Name, 'Filter');
        filterService.getCharacteristic(Characteristic.FilterLifeLevel).on(CharacteristicEventTypes.GET, this.getFilterLifeLevel.bind(this));
        filterService.getCharacteristic(Characteristic.FilterChangeIndication).on(CharacteristicEventTypes.GET, this.getFilterChangeIndication.bind(this));
        filterService.getCharacteristic(Characteristic.ResetFilterIndication).on(CharacteristicEventTypes.SET, this.setResetFilterIndication.bind(this));

        return filterService;
    }

    public handleState(state: ComfoAirState): void
    {
        // update Characteristics
        let filterChange = (state.replaceFilter) ? Characteristic.FilterChangeIndication.CHANGE_FILTER : Characteristic.FilterChangeIndication.FILTER_OK;
        this._filterService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(filterChange);

        let filterLifeLevel = Math.round((state.filterOperatingHours / this._maxFilterOperatingHours) * 100);
        this._filterService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(filterLifeLevel);
    }

    public getService(): Service
    {
        return this._filterService;
    }

    private getFilterLifeLevel(callback: CharacteristicGetCallback)
    {
        this._log.info('get filter life level');

        this._accessory.refreshFilterState((state: ComfoAirState, error?: Error) =>
        {
            if(this._info)
                this._log.info('refreshFilterState callback', error, state.filterOperatingHours);

            let filterLife: number = state.filterOperatingHours / this._maxFilterOperatingHours;

            let filterLifeLevel: CharacteristicValue = Math.round(filterLife * 100);
            callback(error, filterLifeLevel);
        });
    }

    private getFilterChangeIndication(callback: CharacteristicGetCallback)
    {
        this._log.info('get filter change indication');

        this._accessory.refreshFaults((state: ComfoAirState, error?: Error) =>
        {
            if(this._info)
                this._log.info('refreshFaults callback', error, state.replaceFilter);

            let filterChange: CharacteristicValue = state.replaceFilter ? Characteristic.FilterChangeIndication.CHANGE_FILTER : Characteristic.FilterChangeIndication.FILTER_OK;
            callback(error, filterChange);
        });
    }

    private setResetFilterIndication(callback: CharacteristicSetCallback)
    {
        this._log.info('reset filter life level');

        this._accessory.resetFilter((state: ComfoAirState, error?: Error) =>
        {
            if(this._info)
                this._log.info('reset confirmed');

            callback(error);
        });
    }
}