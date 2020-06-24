import {ComfoAirAccessory} from "./ComfoAirAccessory";
import {Fanv2} from "hap-nodejs/dist/lib/gen/HomeKit";
import {
    Characteristic,
    CharacteristicEventTypes,
    CharacteristicGetCallback,
    CharacteristicSetCallback,
    CharacteristicValue,
    Service
} from "hap-nodejs";
import {Logger} from "homebridge/lib/logger";
import {ComfoAirState} from "./ComfoAirState";
import {API} from "homebridge/lib/api";
import {ServiceHandler} from "./ServiceHandler";
import {VentilationLevel} from "./VentilationLevel";

export class FanHandler implements ServiceHandler
{
    private readonly _log: Logger;
    private readonly _api: API;
    private readonly _accessory: ComfoAirAccessory;

    private _updateValueOnActiveChange: boolean;

    private readonly _offLevel: VentilationLevel;
    private readonly _maxFanSpeed: number;
    private readonly _maxLevel: VentilationLevel;

    // Services
    private _fanService: Fanv2;

    constructor(log: Logger, api: API, accessory: ComfoAirAccessory, offLevel: VentilationLevel, maxFanSpeed: number, updateValueOnActiveChange: boolean)
    {
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

    private createService(): Service
    {
        let fanService: Service = new this._api.hap.Service.Fanv2();
        fanService.setCharacteristic(Characteristic.Name, 'Fan');

        // On/Off
        fanService.getCharacteristic(Characteristic.Active)
            .on(CharacteristicEventTypes.GET, this.getFanOnState.bind(this))
            .on(CharacteristicEventTypes.SET, this.setFanOnState.bind(this))
        ;

        fanService.getCharacteristic(Characteristic.CurrentFanState)
            .on(CharacteristicEventTypes.GET, this.getCurrentFanState.bind(this))
        ;

        // Rotation speed
        fanService.getCharacteristic(Characteristic.RotationSpeed)
            .setProps({
                minValue: 0,
                maxValue: this._maxFanSpeed,
                minStep: 25, // should be (this._maxFanSpeed / this._maxLevel) but this messes with HomeKit interfaces when not using a somewhat rounded number
            })
            .on(CharacteristicEventTypes.GET, this.getFanSpeed.bind(this))
            .on(CharacteristicEventTypes.SET, this.setFanSpeed.bind(this))
        ;

        return fanService;
    }

    public handleUpdate(state: ComfoAirState)
    {
        let fanActive = state.power ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
        this._fanService.getCharacteristic(Characteristic.Active).updateValue(fanActive);

        let fanState = this.getFanStateFromState(state);
        this._fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(fanState);

        let speed = ComfoAirAccessory.getVentilationSpeed(state.level);
        let maxSpeed = ComfoAirAccessory.getVentilationSpeed(this._maxLevel);
        let rotationSpeed = (speed / maxSpeed) * this._maxFanSpeed;
        this._fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(rotationSpeed);
    }

    public getService(): Service
    {
        return this._fanService;
    }

    public getFanOnState(callback: CharacteristicGetCallback)
    {
        this._log.info('get fan on state');

        this._accessory.refreshLevelState(
            (state: ComfoAirState, error?: Error) =>
            {
                // if(this.accessory.info)
                this._log.info('refreshTemperatureState callback', error, state.power);

                let fanOnState: CharacteristicValue = (state.power === true) ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE;
                callback(error, fanOnState);
            });
    }

    public setFanOnState(value: CharacteristicValue, callback: CharacteristicSetCallback)
    {
        this._log.info('set fan on state: ' + value);

        if(this._updateValueOnActiveChange)
        {
            let level: VentilationLevel = this._accessory.getState().power ? this._maxLevel : this._offLevel;

            this._accessory.setVentilationLevel(level,
                (state: ComfoAirState, error?: Error) => {
                    callback(error);
                });
        } else {
            this._log.info('^ ignoring message');

            callback();
        }
    }

    public getCurrentFanState(callback: CharacteristicGetCallback)
    {
        this._log.info('get current fan state');

        this._accessory.refreshLevelState((state: ComfoAirState, error?: Error) =>
            {
                let fanState = this.getFanStateFromState(state);

                // if(this.info)
                    this._log.info('refreshTemperatureState callback', error, fanState);

                callback(error, fanState);
            });
    }

    private getFanStateFromState(state: ComfoAirState): CharacteristicValue
    {
        if(state.power)
        {
            if(state.level > this._offLevel + 1)
                return Characteristic.CurrentFanState.BLOWING_AIR;

            if(state.level > this._offLevel)
                return Characteristic.CurrentFanState.IDLE;
        }

        return Characteristic.CurrentFanState.INACTIVE;
    }

    public getFanSpeed(callback: CharacteristicGetCallback)
    {
        this._log.info('get fan speed');

        this._accessory.refreshLevelState((state: ComfoAirState, error?: Error) =>
            {
                let speed: number = ComfoAirAccessory.getVentilationSpeed(state.level);
                let maxSpeed: number = ComfoAirAccessory.getVentilationSpeed(this._maxLevel);

                let a: number = speed / maxSpeed;
                let fanSpeed = a * this._maxFanSpeed;
                callback(error, fanSpeed);
            });
    }

    public setFanSpeed(value: CharacteristicValue, callback: CharacteristicSetCallback)
    {
        let fanSpeed: number = value as number;
        this._log.info('set fan speed: ' + fanSpeed);


        let a: number = fanSpeed / this._maxFanSpeed;

        let maxLevelSpeed: number = ComfoAirAccessory.getVentilationSpeed(this._maxLevel);
        let levelSpeed: number = Math.round(a * maxLevelSpeed);

        let level: VentilationLevel = ComfoAirAccessory.getVentilationLevel(levelSpeed);

        // temp block updates
        this._updateValueOnActiveChange = false;

        this._accessory.setVentilationLevel(level, (state: ComfoAirState, error?: Error) =>
            {
                // release updates
                this._log.info('call callback');
                this._updateValueOnActiveChange = true;
                callback(error);
            });
    }
}