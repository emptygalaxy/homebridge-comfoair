import {ServiceHandler} from "./ServiceHandler";
import {Characteristic, CharacteristicEventTypes, CharacteristicGetCallback, Service} from "hap-nodejs";
import {ComfoAirAccessory} from "./ComfoAirAccessory";
import {ComfoAirState} from "./ComfoAirState";
import {Logger} from "homebridge/lib/logger";
import {API} from "homebridge/lib/api";

export class OutsideTemperatureHandler implements ServiceHandler
{
    private readonly _log: Logger;
    private readonly _api: API;
    private readonly _accessory: ComfoAirAccessory;

    private readonly _info: boolean = true;

    // Services
    private readonly _temperatureSensorService: Service;

    constructor(log: Logger, api: API, accessory: ComfoAirAccessory)
    {
        this._log = log;
        this._api = api;
        this._accessory = accessory;

        this._temperatureSensorService = this.createService();
    }

    createService(): Service
    {
        let temperatureSensorService = new Service.TemperatureSensor();
        temperatureSensorService.setCharacteristic(Characteristic.Name, 'Outside temperature');

        temperatureSensorService.getCharacteristic(Characteristic.CurrentTemperature)
            .on(CharacteristicEventTypes.GET, this.getCurrentOutsideTemperature.bind(this))
        ;

        return temperatureSensorService;
    }

    public handleState(state: ComfoAirState): void
    {
        let currentTemperature: number = ComfoAirAccessory.round(state.outsideTemperature, 2);
        this._temperatureSensorService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(currentTemperature);
    }

    public getService(): Service
    {
        return this._temperatureSensorService;
    }

    getCurrentOutsideTemperature(callback: CharacteristicGetCallback): void
    {
        this._log.info('get current outside temperature');

        this._accessory.refreshTemperatureState((state: ComfoAirState, error?: Error) =>
            {
                if(this._info)
                    this._log.info('refreshTemperatureState callback', error, state.outsideTemperature);

                callback(error, state.outsideTemperature);
            });
    }
}