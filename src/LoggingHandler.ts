import {ServiceHandler} from "./ServiceHandler";
import {Service} from "hap-nodejs";
import {ComfoAirAccessory} from "./ComfoAirAccessory";
import {ComfoAirState} from "./ComfoAirState";
import {Logger} from "homebridge/lib/logger";
import {API} from "homebridge/lib/api";

export class LoggingHandler implements ServiceHandler
{
    private readonly _log: Logger;
    private readonly _api: API;
    private readonly _accessory: ComfoAirAccessory;
    private _historyLength: number;

    // Services
    private readonly _loggingService;

    constructor(log: Logger, api: API, accessory: ComfoAirAccessory, historyLength: number)
    {
        this._log = log;
        this._api = api;
        this._accessory = accessory;
        this._historyLength = historyLength;

        this._loggingService = this.createService();
    }

    private createService(): Service
    {
        const FakeGatoHistoryService = require('fakegato-history')(this._api);

        let loggingType: string = 'thermo';

        return new FakeGatoHistoryService(loggingType, this._accessory, this._historyLength);
    }

    public handleState(state: ComfoAirState): void
    {
        // update Characteristics
        let date = new Date();
        let time = Math.round(date.getTime() / 1000);
        let entry = {
            time: time,
            currentTemp: state.outsideTemperature,
            setTemp: state.targetTemperature,
            valvePosition: 0
        };
        this._loggingService.addEntry(entry);
    }

    public getService(): Service
    {
        return this._loggingService;
    }
}