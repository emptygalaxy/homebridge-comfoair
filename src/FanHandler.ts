import {ComfoAirAccessory} from './ComfoAirAccessory';
import {Fanv2} from 'hap-nodejs/dist/lib/gen/HomeKit';
import { Service, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback, CharacteristicEventTypes } from 'homebridge';
import {Logger} from 'homebridge/lib/logger';
import {ComfoAirState} from './ComfoAirState';
import {API} from 'homebridge/lib/api';
import {ServiceHandler} from './ServiceHandler';
import {VentilationLevel} from './VentilationLevel';

export class FanHandler implements ServiceHandler {
    private readonly _log: Logger;
    private readonly _api: API;
    private readonly _accessory: ComfoAirAccessory;

    private _updateValueOnActiveChange: boolean;

    private readonly _offLevel: VentilationLevel;
    private readonly _maxFanSpeed: number;
    private readonly _maxLevel: VentilationLevel;

    // Services
    private readonly _fanService: Fanv2;

    constructor(log: Logger, api: API, accessory: ComfoAirAccessory, offLevel: VentilationLevel,
        maxFanSpeed: number, updateValueOnActiveChange: boolean) {

        this._log = log;
        this._api = api;
        this._accessory = accessory;
        this._offLevel = offLevel;
        this._maxFanSpeed = maxFanSpeed;
        this._updateValueOnActiveChange = updateValueOnActiveChange;

        this._maxLevel = VentilationLevel.High;

        // services
        this._fanService = this.createService();
    }

    private createService(): Service {
        const fanService: Service = new this._api.hap.Service.Fanv2();
        fanService.setCharacteristic(this._api.hap.Characteristic.Name, 'Fan');

        // On/Off
        fanService.getCharacteristic(this._api.hap.Characteristic.Active)
            .on(CharacteristicEventTypes.GET, this.getFanOnState.bind(this))
            .on(CharacteristicEventTypes.SET, this.setFanOnState.bind(this))
        ;

        fanService.getCharacteristic(this._api.hap.Characteristic.CurrentFanState)
            .on(CharacteristicEventTypes.GET, this.getCurrentFanState.bind(this))
        ;

        // Rotation speed
        fanService.getCharacteristic(this._api.hap.Characteristic.RotationSpeed)
            .setProps({
                minValue: 0,
                maxValue: this._maxFanSpeed,
                // should be (this._maxFanSpeed / this._maxLevel)
                // but this messes with HomeKit interfaces when not using a somewhat rounded number
                minStep: 25,
            })
            .on(CharacteristicEventTypes.GET, this.getFanSpeed.bind(this))
            .on(CharacteristicEventTypes.SET, this.setFanSpeed.bind(this))
        ;

        return fanService;
    }

    public handleUpdate(state: ComfoAirState) {
        const fanActive = state.power ? this._api.hap.Characteristic.Active.ACTIVE : this._api.hap.Characteristic.Active.INACTIVE;
        this._fanService.getCharacteristic(this._api.hap.Characteristic.Active).updateValue(fanActive);

        const fanState = this.getFanStateFromState(state);
        this._fanService.getCharacteristic(this._api.hap.Characteristic.CurrentFanState).updateValue(fanState);

        const speed = ComfoAirAccessory.getVentilationSpeed(state.level);
        const maxSpeed = ComfoAirAccessory.getVentilationSpeed(this._maxLevel);
        const rotationSpeed = (speed / maxSpeed) * this._maxFanSpeed;
        this._fanService.getCharacteristic(this._api.hap.Characteristic.RotationSpeed).updateValue(rotationSpeed);
    }

    public getService(): Service {
        return this._fanService;
    }

    public getFanOnState(callback: CharacteristicGetCallback) {
        this._log.info('get fan on state');

        this._accessory.refreshLevelState(
            (state: ComfoAirState, error?: Error) => {
                // if(this.accessory.info)
                this._log.info('refreshTemperatureState callback', error, state.power);

                const fanOnState: CharacteristicValue = (state.power === true) ?
                    this._api.hap.Characteristic.Active.ACTIVE :
                    this._api.hap.Characteristic.Active.INACTIVE;
                callback(error, fanOnState);
            });
    }

    public setFanOnState(value: CharacteristicValue, callback: CharacteristicSetCallback) {
        this._log.info('set fan on state: ' + value);

        if(this._updateValueOnActiveChange) {
            const level: VentilationLevel = this._accessory.getState().power ? this._maxLevel : this._offLevel;

            this._accessory.setVentilationLevel(level,
                (state: ComfoAirState, error?: Error) => {
                    callback(error);
                });
        } else {
            this._log.info('^ ignoring message');

            callback();
        }
    }

    public getCurrentFanState(callback: CharacteristicGetCallback) {
        this._log.info('get current fan state');

        this._accessory.refreshLevelState((state: ComfoAirState, error?: Error) => {
            const fanState = this.getFanStateFromState(state);

            this._log.info('refreshTemperatureState callback', error, fanState);

            callback(error, fanState);
        });
    }

    private getFanStateFromState(state: ComfoAirState): CharacteristicValue {
        if(state.power) {
            if(state.level > this._offLevel + 1) {
                return this._api.hap.Characteristic.CurrentFanState.BLOWING_AIR;
            }

            if(state.level > this._offLevel) {
                return this._api.hap.Characteristic.CurrentFanState.IDLE;
            }
        }

        return this._api.hap.Characteristic.CurrentFanState.INACTIVE;
    }

    public getFanSpeed(callback: CharacteristicGetCallback) {
        this._log.info('get fan speed');

        this._accessory.refreshLevelState((state: ComfoAirState, error?: Error) => {
            const speed: number = ComfoAirAccessory.getVentilationSpeed(state.level);
            const maxSpeed: number = ComfoAirAccessory.getVentilationSpeed(this._maxLevel);

            const a: number = speed / maxSpeed;
            const fanSpeed = a * this._maxFanSpeed;
            callback(error, fanSpeed);
        });
    }

    public setFanSpeed(value: CharacteristicValue, callback: CharacteristicSetCallback) {
        const fanSpeed: number = value as number;
        this._log.info('set fan speed: ' + fanSpeed);


        const a: number = fanSpeed / this._maxFanSpeed;

        const maxLevelSpeed: number = ComfoAirAccessory.getVentilationSpeed(this._maxLevel);
        const levelSpeed: number = Math.round(a * maxLevelSpeed);

        const level: VentilationLevel = ComfoAirAccessory.getVentilationLevel(levelSpeed);

        // temp block updates
        this._updateValueOnActiveChange = false;

        this._accessory.setVentilationLevel(level, (state: ComfoAirState, error?: Error) => {
            // release updates
            this._log.info('call callback');
            this._updateValueOnActiveChange = true;
            callback(error);
        });
    }
}