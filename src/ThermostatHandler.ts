import {ServiceHandler} from "./ServiceHandler";
import {
    Characteristic,
    CharacteristicEventTypes,
    CharacteristicGetCallback, CharacteristicSetCallback,
    CharacteristicValue,
    Service
} from "hap-nodejs";
import {Fan, Fanv2} from "hap-nodejs/dist/lib/gen/HomeKit";
import {Logger} from "homebridge/lib/logger";
import {API} from "homebridge/lib/api";
import {ComfoAirAccessory} from "./ComfoAirAccessory";
import {ComfoAirState} from "./ComfoAirState";

export class ThermostatHandler implements ServiceHandler
{
    private readonly _log: Logger;
    private readonly _api: API;
    private readonly _accessory: ComfoAirAccessory;

    private readonly _info: boolean = true;

    // Services
    private readonly _thermostatService: Service;

    constructor(log: Logger, api: API, accessory: ComfoAirAccessory)
    {
        this._log = log;
        this._api = api;
        this._accessory = accessory;

        this._thermostatService = this.createService();
    }

    private createService(): Service
    {
        let thermostatService = new Service.Thermostat('Comfort temperature', 'inside');
        thermostatService.setCharacteristic(Characteristic.Name, 'Comfort temperature');
        thermostatService.getCharacteristic(Characteristic.TargetTemperature)
            .on(CharacteristicEventTypes.GET, this.getTargetTemperature.bind(this))
            .on(CharacteristicEventTypes.SET, this.setTargetTemperature.bind(this))
        ;

        // inside temperature
        thermostatService.getCharacteristic(Characteristic.CurrentTemperature)
            .on(CharacteristicEventTypes.GET, this.getCurrentTemperature.bind(this))
        ;

        thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
            .setProps({
                minValue: Characteristic.CurrentHeatingCoolingState.OFF,
                maxValue: Characteristic.CurrentHeatingCoolingState.COOL,
            })
            .on(CharacteristicEventTypes.GET, this.getCurrentHeatingCoolingState.bind(this))
        ;
        thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState)
            .setProps({
                minValue: Characteristic.TargetHeatingCoolingState.AUTO,
                maxValue: Characteristic.TargetHeatingCoolingState.AUTO,
            })
            .on(CharacteristicEventTypes.GET, this.getTargetHeatingCoolingState.bind(this))
        // .on(CharacteristicEventTypes.SET, this.setTargetHeatingCoolingState.bind(this))
        ;

        return thermostatService;
    }

    public getService(): Service
    {
        return this._thermostatService;
    }

    public handleState(state: ComfoAirState)
    {
        // update Characteristics
        this._thermostatService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(ComfoAirAccessory.round(state.insideTemperature, 2));
    }

    getTargetTemperature(callback: CharacteristicGetCallback): void
    {
        this._log.info('get comfort temperature');

        callback(null, this._accessory.getState().targetTemperature);
    }

    setTargetTemperature(value: CharacteristicValue, callback: CharacteristicSetCallback): void
    {
        this._log.info('set target temperature: ' + value);

        let temperature: number = value as number;
        this._accessory.setTemperature(temperature, (state: ComfoAirState, error?: Error) =>
            {
                callback(error);

                // update current heating/cooling state
                this.getCurrentHeatingCoolingState((err2: Error|null|undefined, heatingCoolingState: CharacteristicValue|undefined) =>
                {
                    if(heatingCoolingState)
                        this._thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).updateValue(heatingCoolingState);
                });
            });
    }

    getCurrentTemperature(callback: CharacteristicGetCallback): void
    {
        this._log.info('get current temperature');

        this._accessory.refreshTemperatureState((state: ComfoAirState, error?: Error) =>
            {
                if(this._info)
                    this._log.info('refreshTemperatureState callback', error, state.insideTemperature);

                callback(error, state.insideTemperature);
            });
    }

    getCurrentHeatingCoolingState(callback: CharacteristicGetCallback<CharacteristicValue>): void
    {
        let heatingCoolingState = Characteristic.CurrentHeatingCoolingState.OFF;

        let state: ComfoAirState = this._accessory.getState();

        let difTemperature = state.targetTemperature - state.insideTemperature;
        if(difTemperature > 1)
            heatingCoolingState = Characteristic.CurrentHeatingCoolingState.HEAT;
        else if(difTemperature < -1)
            heatingCoolingState = Characteristic.CurrentHeatingCoolingState.COOL;

        this._log.info('get current heating cooling state: ' + heatingCoolingState + ' ('+state.insideTemperature+'->'+state.targetTemperature+')');

        callback(null, heatingCoolingState);
    }

    getTargetHeatingCoolingState(callback: CharacteristicGetCallback): void
    {
        this._log.info('get target heating cooling state');

        // set to auto
        callback(null, Characteristic.TargetHeatingCoolingState.AUTO);
    }

}