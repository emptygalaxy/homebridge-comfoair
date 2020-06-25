import {ComfoAirConfig} from './ComfoAirConfig';
import {ComfoAirState} from './ComfoAirState';

import {AccessoryPlugin, API} from 'homebridge/lib/api';
import {Logger} from 'homebridge/lib/logger';
import {AccessoryConfig} from 'homebridge/lib/server';
import {FanHandler} from './FanHandler';
import { Service } from 'homebridge';
import {ThermostatHandler} from './ThermostatHandler';
import {ServiceHandler} from './ServiceHandler';
import {OutsideTemperatureHandler} from './OutsideTemperatureHandler';
import {FilterHandler} from './FilterHandler';
import {VentilationLevel} from './VentilationLevel';
import {TemperaturesResponse} from './types/Temperatures';

import {Comfoair} from './Comfoair';
import {ComfoAirSetResponse} from './types/ComfoAirResponse';
import {TemperatureStatesResponse} from './types/TemperatureStates';
import {VentilationLevelResponse} from './types/VentilationLevel';
import Timeout = NodeJS.Timeout;
import {OperatingHoursResponse} from './types/OperatingHours';
import {FaultsResponse} from './types/Faults';
import {LoggingHandler} from './LoggingHandler';
const Comfoair = require('comfoair');

export class ComfoAirAccessory implements AccessoryPlugin {
    private readonly log: Logger;
    private readonly config: ComfoAirConfig;
    private readonly api: API;

    private readonly debug: boolean = true;
    public readonly info: boolean = true;

    private readonly port: string;
    private readonly baudRate: number;

    private readonly deviceName: string = 'testing';
    private readonly deviceManufacturer: string;
    private readonly deviceModel: string;
    private readonly deviceSerial: string;

    private readonly minTemperature: number;
    private readonly maxTemperature: number;

    private readonly maxFilterOperatingHours: number;

    private readonly updateInterval: number;
    private readonly updateIntervalId: Timeout;

    private readonly setOffToLow: boolean;
    private readonly offLevel: VentilationLevel;
    private readonly maxFanSpeed: number = 100;
    private readonly historyLength: number;

    private updateValueOnActiveChange = true;

    private readonly state: ComfoAirState;

    private readonly ventilation?: Comfoair;

    // handlers
    private readonly _fanHandler?:FanHandler;
    private readonly _thermostatHandler?:ThermostatHandler;
    private readonly _outsideTemperatureHandler?: OutsideTemperatureHandler;
    private readonly _filterHandler?: FilterHandler;
    private readonly _loggingHandler?: LoggingHandler;

    // Services
    private informationService?: Service;

    constructor(log: Logger, config: AccessoryConfig, api: API) {
        this.log = log;
        this.config = config as ComfoAirConfig;
        this.api = api;

        this.debug = this.config.debug || false;
        this.info = this.config.info || false;

        this.port = this.config.port || '/dev/tty';
        this.baudRate = this.config.baudRate || 9600;

        this.deviceName = this.config.deviceName || 'Ventilation';
        this.deviceManufacturer = this.config.deviceManufacturer || 'Comfoair';
        this.deviceModel = this.config.deviceModel || 'Comfoair';
        this.deviceSerial = this.config.deviceSerial || '';

        this.minTemperature = this.config.minTemperature || 15;
        this.maxTemperature = this.config.maxTemperature || 35;
        this.maxFilterOperatingHours = this.config.maxFilterOperatingHours || 30;

        this.updateInterval = this.config.updateInterval || 30;
        this.updateIntervalId = setInterval(this.update.bind(this), this.updateInterval * 1000);

        this.setOffToLow = this.config.setOffToLow || true;
        this.offLevel = this.setOffToLow ? VentilationLevel.Low : VentilationLevel.Away;

        this.historyLength = this.config.historyLength || 4032;

        // initial state
        this.state = {
            power: false,
            level: VentilationLevel.Low,
            targetTemperature: 22,
            insideTemperature: 20,
            outsideTemperature: 15,
            filterOperatingHours: 0,
            replaceFilter: false,
        };

        if(this.info) {
            this.log.info('config', config);
        }

        // handlers
        this._fanHandler = new FanHandler(this.log, this.api, this, this.offLevel, this.maxFanSpeed, this.updateValueOnActiveChange);
        this._thermostatHandler = new ThermostatHandler(this.log, this.api, this);
        this._outsideTemperatureHandler = new OutsideTemperatureHandler(this.log, this.api, this);
        this._filterHandler = new FilterHandler(this.log, this.api, this, this.maxFilterOperatingHours);
        this._loggingHandler = new LoggingHandler(this.log, this.api, this, this.historyLength);

        this.log.info('Connecting to ', this.port);
        this.ventilation = new Comfoair({
            port: this.port,
            baud: this.baudRate,
        });

        this.update();
    }

    public identify() {
        this.log.info(this.deviceName + ' requested identification');
    }

    public getServices(): Service[] {
        const services: Service[] = [
            this.getInformationService(),
        ];

        const handlers: (ServiceHandler|undefined)[] = [
            this._fanHandler,
            this._thermostatHandler,
            this._outsideTemperatureHandler,
            this._filterHandler,
            this._loggingHandler,
        ];

        handlers.forEach((handler: ServiceHandler|undefined) => {
            if(handler) {
                services.push(handler.getService());
            }
        });

        return services;
    }

    getInformationService(): Service {
        this.informationService = new this.api.hap.Service.AccessoryInformation();
        this.informationService
            .setCharacteristic(this.api.hap.Characteristic.Name, this.deviceName)
            .setCharacteristic(this.api.hap.Characteristic.Manufacturer, this.deviceManufacturer)
            .setCharacteristic(this.api.hap.Characteristic.Model, this.deviceModel)
            .setCharacteristic(this.api.hap.Characteristic.SerialNumber, this.deviceSerial)
        ;

        return this.informationService;
    }

    public getState(): ComfoAirState {
        return this.state;
    }

    private update(): void {
        this.log.info(this.deviceName, 'update');


        this.log.info('');
        this.log.info('Interval update');

        if(this._thermostatHandler || this._outsideTemperatureHandler) {
            this.refreshTemperatureState((state: ComfoAirState) => {
                this.log.info('Inside temperature: ' + state.insideTemperature);
            });
        }

        if(this._fanHandler) {
            this.refreshLevelState((state: ComfoAirState) => {
                this.log.info('Power=' + state.power);
                this.log.info('Speed: ' + state.level);
            });
        }

        if(this._filterHandler) {
            this.refreshFilterState((state: ComfoAirState) => {
                this.log.info('filterOperatingHours=' + state.filterOperatingHours);
                this.log.info('FilterLifeLevel=' + Math.round((state.filterOperatingHours / this.maxFilterOperatingHours) * 100));
            });
            this.refreshFaults((state: ComfoAirState) => {
                this.log.info('replaceFilter=' + state.replaceFilter);
            });
        }
    }

    public setVentilationLevel(level: VentilationLevel, callback: (state: ComfoAirState, error?: Error) => void): void {
        const levelString = level.toString();
        this.log.info('set level to ' + levelString);

        if(this.ventilation) {
            this.ventilation.setLevel(levelString, (err: Error|undefined, resp:ComfoAirSetResponse) => {
                this.handleSetVentilationLevel(level, callback, err, resp);
            });
        } else {
            this.handleSetVentilationLevel(level, callback,
                this.debug ? undefined : new Error('Not connected'), <ComfoAirSetResponse>{});
        }
    }

    private handleSetVentilationLevel(level: VentilationLevel, callback: (state: ComfoAirState, error?: Error) => void,
        err: Error|undefined, resp: ComfoAirSetResponse): void {

        if(err) {
            this.log.error('error setting level to ' + level);
        } else {
            if(this.info) {
                this.log.info('confirmation set level (' + level + ')', resp);
            }

            // update state
            this.state.level = level;

            const speed: number = ComfoAirAccessory.getVentilationSpeed(level);
            const offSpeed: number = ComfoAirAccessory.getVentilationSpeed(this.offLevel);
            this.state.power = speed > offSpeed;
        }

        callback.apply(this, [this.state, err]);
    }

    public setTemperature(temperature: number, callback: (state: ComfoAirState, error?: Error) => void): void {
        this.log.info('set temperature to ' + temperature);

        if(this.ventilation) {
            this.ventilation.setComfortTemperature(temperature,
                (err: Error|undefined, resp: ComfoAirSetResponse) => {
                    this.handleSetComfortTemperature(temperature, resp, callback, err);
                });
        } else {
            this.handleSetComfortTemperature(temperature, <ComfoAirSetResponse>{}, callback,
                this.debug ? undefined : new Error('Not connected'));
        }
    }

    private handleSetComfortTemperature(temperature: number, response: ComfoAirSetResponse,
        callback: (state: ComfoAirState, error?: Error) => void, err?: Error): void {

        if(err) {
            this.log.error('error setting comfort temperature to ' + temperature);
        } else {
            if(this.info) {
                this.log.info('confirmation set temperature (' + temperature + ')');
            }

            this.state.targetTemperature = temperature;

            if(this._thermostatHandler) {
                this._thermostatHandler.handleState(this.state);
            }
        }

        callback.apply(this, [this.state, err]);
    }

    refreshTemperatureState(callback?: (state: ComfoAirState, error?: Error) => void): void {
        if(this.ventilation) {
            this.ventilation.getTemperatureStates((err: Error|undefined, resp: TemperatureStatesResponse) => {
                this.handleTemperatureStates(resp, callback);
            });
        } else {
            this.handleTemperatureStates(<TemperaturesResponse>{
                valid: true,
                payload: {
                    outsideAir: {
                        value: 15,
                    },
                    outgoingAir: {
                        value: 20,
                    },
                },
            }, callback, this.debug ? undefined : new Error('Not connected'));
        }
    }

    private handleTemperatureStates(response: TemperatureStatesResponse,
        callback?: (state: ComfoAirState, error?: Error) => void, err?: Error) {

        if(err) {
            this.log.error(err.message);
        } else {
            if(this.info) {
                this.log.info('Got temperatures:');
                this.log.info(response.toString());
            }

            // characteristics
            if(response && response.valid && response.payload && response.payload.outsideAir && response.payload.outgoingAir) {
                this.state.outsideTemperature = response.payload.outsideAir.value;
                this.state.insideTemperature = response.payload.outgoingAir.value;
            }

            // handlers
            if(this._thermostatHandler) {
                this._thermostatHandler.handleState(this.state);
            }

            if(this._outsideTemperatureHandler) {
                this._outsideTemperatureHandler.handleState(this.state);
            }

            if(this._loggingHandler) {
                this._loggingHandler.handleState(this.state);
            }
        }

        if(callback) {
            callback.apply(this, [this.state, err]);
        }
    }

    public refreshLevelState(callback: (state: ComfoAirState, error?: Error) => void): void {
        if(this.ventilation) {
            this.ventilation.getVentilationLevel((err: Error|undefined, resp: VentilationLevelResponse) => {
                this.handleRefreshLevelState(resp, callback);
            });
        } else {
            this.handleRefreshLevelState(<VentilationLevelResponse>{
                valid: true,
                payload: {
                    currentLevel: {
                        value: 5,
                    },
                },
            }, callback, this.debug ? undefined : new Error('Not connected'));
        }
    }

    private handleRefreshLevelState(response: VentilationLevelResponse,
        callback: (state: ComfoAirState, error?: Error) => void, err?: Error): void {

        if (err) {
            this.log.error(err.message);
        } else {
            if(this.info) {
                this.log.info('Got levels:', response);
            }

            if(response && response.valid && response.payload && response.payload.currentLevel) {
                const speed: number = response.payload.currentLevel.value - 1;
                const level: VentilationLevel = ComfoAirAccessory.getVentilationLevel(speed);

                if (this.info) {
                    this.log.info('level: ' + level);
                }

                // update states
                this.state.level = level;
                const offSpeed: number = ComfoAirAccessory.getVentilationSpeed(this.offLevel);
                this.state.power = speed > offSpeed;

                // update handlers
                if (this._fanHandler) {
                    this._fanHandler.handleUpdate(this.state);
                }
            }
        }

        if(callback) {
            callback.apply(this, [this.state, err]);
        }
    }

    public resetFilter(callback?: (state: ComfoAirState, error?: Error) => void) {
        if(this.ventilation) {
            this.ventilation.reset(
                false,
                false,
                false,
                true,
                (err, resp) => {
                    this.handleResetFilter(resp, callback, err);
                });
        } else {
            this.handleResetFilter(<ComfoAirSetResponse>{
                type: 'ACK',
            }, callback, this.debug ? undefined : new Error('Not connected'));
        }
    }

    private handleResetFilter(response: ComfoAirSetResponse, callback?: (state: ComfoAirState, error?: Error) => void, err?: Error): void {
        if(err) {
            this.log.error(err.message);
        } else {
            if(this.info) {
                this.log.info('reset filter confirmation');
            }

            // update states
            if(response.type === 'ACK') {
                this.state.filterOperatingHours = 0;
                this.state.replaceFilter = false;
            }

            // handlers
            if(this._filterHandler) {
                this._filterHandler.handleState(this.state);
            }
        }

        if(callback) {
            callback.apply(this, [this.state, err]);
        }
    }

    refreshFilterState(callback?: (state: ComfoAirState, error?: Error) => void) {
        if(this.ventilation) {
            this.ventilation.getOperatingHours((err, resp) => {
                this.handleRefreshFilterState(resp, callback, err);
            });
        } else {
            this.handleRefreshFilterState(<OperatingHoursResponse>{
                valid: true,
                payload: {
                    filter: {
                        label: '',
                        unit: 'h',
                        value: this.state.filterOperatingHours + Math.round(Math.random() * this.maxFilterOperatingHours * 0.2),
                    },
                },
            }, callback, this.debug ? undefined : new Error('Not connected'));
        }
    }

    private handleRefreshFilterState(response: OperatingHoursResponse,
        callback?: (state: ComfoAirState, error?: Error) => void, err?: Error): void {

        if(err) {
            this.log.error(err.message);
        } else {
            if(this.info) {
                this.log.info('Got operating hours', response);
            }

            if(response && response.valid && response.payload && response.payload.filter) {
                // update states
                this.state.filterOperatingHours = response.payload.filter.value;

                // handlers
                if (this._filterHandler) {
                    this._filterHandler.handleState(this.state);
                }
            }
        }

        if(callback) {
            callback.apply(this, [this.state, err]);
        }
    }

    refreshFaults(callback?: (state: ComfoAirState, error?: Error) => void) {
        if(this.ventilation) {
            this.ventilation.getFaults(
                (err, resp) => {
                    this.handleGetFaults(resp, callback, err);
                });
        } else {
            this.handleGetFaults(<FaultsResponse>{
                valid: true,
                payload: {
                    replaceFilter: {
                        label: '',
                        value: Math.random() > 0.7,
                    },
                },
            }, callback, this.debug ? undefined : new Error('Not connected'));
        }
    }

    private handleGetFaults(response: FaultsResponse, callback?: (state: ComfoAirState, error?: Error) => void, err?: Error): void {
        if(err) {
            this.log.error(err.message);
        } else {
            if(this.info) {
                this.log.info('Got faults', response);
            }

            if(response && response.valid && response.payload && response.payload.replaceFilter) {
                // update states
                this.state.replaceFilter = response.payload.replaceFilter.value;

                // handlers
                if(this._filterHandler) {
                    this._filterHandler.handleState(this.state);
                }
            }
        }

        if(callback) {
            callback.apply(this, [this.state, err]);
        }
    }

    /**
     *
     * @param {number} n
     * @param {number} digits
     * @return {number}
     */
    static round(n, digits) {
        const x = Math.pow(10, digits);
        return Math.round(n * x) / x;
    }

    static getVentilationLevel(speed: number): VentilationLevel {
        switch(speed) {
            default:
            case 0:
                return VentilationLevel.Away;
            case 1:
                return VentilationLevel.Low;
            case 2:
                return VentilationLevel.Middle;
            case 3:
                return VentilationLevel.High;
        }
    }

    static getVentilationSpeed(level: VentilationLevel): number {
        switch(level) {
            default:
            case VentilationLevel.Away:
                return 0;
            case VentilationLevel.Low:
                return 1;
            case VentilationLevel.Middle:
                return 2;
            case VentilationLevel.High:
                return 3;
        }
    }
}