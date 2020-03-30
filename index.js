'use strict'

/**
 * @type {Comfoair}
 */
const Comfoair = require('comfoair');

/**
 *
 * @type {*|(function(): FakeGatoHistory)}
 */
const FakeGatoHistoryService = require('fakegato-history')(homebridge);

/**
 *
 * @type {{away: number, middle: number, HIGH: number, "0": string, AWAY: number, "1": string, "2": string, high: number, "3": string, low: number, LOW: number, MIDDLE: number}}
 */
const VentilationLevel = {
    0: 'away',
    1: 'low',
    2: 'middle',
    3: 'high',
    away: 0,
    AWAY: 0,
    low: 1,
    LOW: 1,
    middle: 2,
    MIDDLE: 2,
    high: 3,
    HIGH: 3,
};

/**
 * @type HAPNodeJS.Service
 */
let Service;


/**
 * @typedef {import('node_modules/hap-nodejs/src/lib/Characteristic.ts').Characteristic} Characteristic
 * #@type HAPNodeJS.Characteristic
 * @type {import('./node_modules/hap-nodejs/src/lib/Characteristic.ts').Characteristic}
 */
let Characteristic;

/**
 *
 * @type {{SET: string, UNSUBSCRIBE: string, GET: string, CHANGE: string, SUBSCRIBE: string}}
 */
const CharacteristicEventTypes = {
    GET: "get",
    SET: "set",
    SUBSCRIBE: "subscribe",
    UNSUBSCRIBE: "unsubscribe",
    CHANGE: "change",
};

/**
 *
 * @param homebridge
 */
module.exports = function(homebridge)
{
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-comfoair', 'ComfoAir', ComfoAirAccessory);
};


class ComfoAirAccessory
{
    /**
     *
     * @param {Function} log
     * @param {Object} config
     */
    constructor(log, config)
    {
        /**
         *
         * @type {Function}
         */
        this.log = log;

        /**
         *
         * @type {Object}
         */
        this.config = config;

        /**
         *
         * @type {boolean}
         */
        this.debug = false;

        /**
         *
         * @type {string}
         */
        this.deviceName = this.config['name'] || 'Fan';

        /**
         *
         * @type {string}
         */
        this.deviceManufacturer = this.config['manufacturer'] || 'Comfoair';

        /**
         *
         * @type {string}
         */
        this.deviceModel = 'ComfoAir';

        /**
         *
         * @type {string}
         */
        this.deviceSerial = '';

        /**
         * Serial port device
         * @type {string}
         */
        this.port = this.config['port'] || '/dev/tty';

        /**
         *
         * @type {number}
         */
        this.baudRate = this.config['baudRate'] || 9600;

        /**
         *
         * @type {number}
         */
        this.minTemperature = this.config['minTemperature'] || 15;

        /**
         *
         * @type {number}
         */
        this.maxTemperature = this.config['maxTemperature'] || 30;

        /**
         *
         * @type {number}
         */
        this.maxFilterOperatingHours = this.config['maxFilterOperatingHours'] || 30;

        /**
         *
         * @type {number}
         */
        this.updateInterval = this.config['updateInterval'] || 30;

        /**
         *
         * @type {boolean}
         */
        this.setOffToLow = this.config['setOffToLow'] || true;
        this.offSpeed = (this.setOffToLow ? 1 : 0);

        /**
         *
         * @typedef {{outsideTemperature: number, targetTemperature: number, insideTemperature: number, power: boolean, speed: number, filterOperatingHours: number, replaceFilter: boolean}} FanState
         * @type {FanState}
         */
        this.state = {
            power: false,
            speed: 0,
            targetTemperature: 22,
            insideTemperature: 20,
            outsideTemperature: 15,
            filterOperatingHours: 0,
            replaceFilter: false,
        };

        /**
         *
         * @type {FakeGatoHistoryService}
         */
        this.loggingService = new FakeGatoHistoryService('thermo', this, {size: 4032, disableTimer: true});


        /**
         *
         * @type {Comfoair}
         */
        this.ventilation = null;

        if(!this.debug) {
            this.ventilation = new Comfoair({
                port: this.port,
                baud: this.baudRate,
            });

            this.ventilation.on('open', this.handleVentilationOpen.bind(this));
            this.ventilation.on('error', this.handleVentilationError.bind(this));
            this.ventilation.on('close', this.handleVentilationClose.bind(this));
        }

        // set interval for updating
        this.intervalId = setInterval(this.update.bind(this), this.updateInterval * 1000);

        this.log(config);
    }

    /**
     *
     * @param {function(null|Error)} callback
     */
    identify(callback)
    {
        this.log(this.deviceName + ' requested identification');

        callback(null);
    }

    /**
     * Get services associated with the accessory
     * @return {Service[]}
     */
    getServices()
    {
        /** @type {Service[]} */
        let services = [];

        services.push(this.getFanService());
        services.push(this.getThermostatService());
        services.push(this.getOutsideTemperatureService());
        services.push(this.getFilterService());

        services.push(this.getInformationService());

        return services;
    }

    /**
     *
     * @return {Service.AccessoryInformation}
     */
    getInformationService()
    {
        /**
         *
         * @type {Service.AccessoryInformation}
         */
        this.informationService = new Service.AccessoryInformation();
        this.informationService
            .setCharacteristic(Characteristic.Name, this.deviceName)
            .setCharacteristic(Characteristic.Manufacturer, this.deviceManufacturer)
            .setCharacteristic(Characteristic.Model, this.deviceModel)
            .setCharacteristic(Characteristic.SerialNumber, this.deviceSerial);

        return this.informationService;
    }

    getFanService()
    {
        /**
         * Fan service
         * @type {Service.Fan}
         */
        this.fanService = new Service.Fanv2();
        this.fanService.setCharacteristic(Characteristic.Name, 'Fan');

        // On/Off
        this.fanService.getCharacteristic(Characteristic.Active)
            .on(CharacteristicEventTypes.GET, this.getFanOnState.bind(this))
            .on(CharacteristicEventTypes.SET, this.setFanOnState.bind(this))
        ;

        this.fanService.getCharacteristic(Characteristic.CurrentFanState)
            .on(CharacteristicEventTypes.GET, this.getCurrentFanState.bind(this))
        ;

        // Rotation speed
        this.fanService.getCharacteristic(Characteristic.RotationSpeed)
            .setProps({
                minValue: this.offSpeed,
                maxValue: 3,
                minStep: 1,
            })
            .on(CharacteristicEventTypes.GET, this.getFanSpeed.bind(this))
            .on(CharacteristicEventTypes.SET, this.setFanSpeed.bind(this));

        return this.fanService;
    }

    /**
     *
     * @param {function(null|Error, boolean)} callback
     */
    getFanOnState(callback)
    {
        this.log('get fan on state');

        this.refreshLevelState(
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            (err, state) =>
            {
                this.log('refreshTemperatureState callback', err, this.state.power);
                callback(err, (this.state.power === true ? Characteristic.Active.ACTIVE : Characteristic.Active.INACTIVE));
            });
    }

    /**
     *
     * @param {number} value
     * @param {function(null|Error)} callback
     */
    setFanOnState(value, callback)
    {
        this.log('set fan on state: ' + value);

        let defaultValue = this.offSpeed + 1;

        this.state.power = value === Characteristic.Active.ACTIVE;

        if(this.state.speed === this.offSpeed)
            this.state.speed = defaultValue;

        let speed = this.state.power ? defaultValue : this.offSpeed;

        this.setVentilationSpeed(speed,
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            (err, state) =>
            {
                callback(err);
            });
    }


    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getCurrentFanState(callback)
    {
        this.log('get current fan state');
        this.log('this:', this);

        this.refreshLevelState(
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            (err, state) =>
            {
                this.log('this:', this);

                let fanState = this.getFanStateFromState();
                this.log('refreshTemperatureState callback', err, fanState);

                callback(err, fanState);
            });
    }

    /**
     *
     * @return {number}
     */
    getFanStateFromState()
    {
        if(this.state.power) {
            if(this.state.speed > this.offSpeed + 1)
                return Characteristic.CurrentFanState.BLOWING_AIR;

            if(this.state.speed > this.offSpeed)
                return Characteristic.CurrentFanState.IDLE;
        }

        return Characteristic.CurrentFanState.INACTIVE;
    }

    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getFanSpeed(callback)
    {
        this.log('get fan speed');

        this.refreshLevelState(
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            (err, state) =>
            {
                callback(err, this.state.speed);
            });
    }

    /**
     *
     * @param {number} value
     * @param {function(null|Error)} callback
     */
    setFanSpeed(value, callback)
    {
        this.log('set fan on state: ' + value);

        this.setVentilationSpeed(value,
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            (err, state) =>
            {
                callback(err);
            });
    }

    /**
     *
     * @return {Service.Thermostat}
     */
    getThermostatService()
    {
        /**
         * Thermostat service
         * @type {Service.Thermostat}
         */
        this.thermostatService = new Service.Thermostat('Comfort temperature', 'inside');
        this.thermostatService.setCharacteristic(Characteristic.Name, 'Comfort temperature');
        this.thermostatService.getCharacteristic(Characteristic.TargetTemperature)
            .on(CharacteristicEventTypes.GET, this.getTargetTemperature.bind(this))
            .on(CharacteristicEventTypes.SET, this.setTargetTemperature.bind(this))
        ;

        // inside temperature
        this.thermostatService.getCharacteristic(Characteristic.CurrentTemperature)
            .on(CharacteristicEventTypes.GET, this.getCurrentTemperature.bind(this))
        ;

        this.thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
            .setProps({
                minValue: Characteristic.CurrentHeatingCoolingState.OFF,
                maxValue: Characteristic.CurrentHeatingCoolingState.COOL,
            })
            .on(CharacteristicEventTypes.GET, this.getCurrentHeatingCoolingState.bind(this))
        ;
        this.thermostatService.getCharacteristic(Characteristic.TargetHeatingCoolingState)
            .setProps({
                minValue: Characteristic.TargetHeatingCoolingState.AUTO,
                maxValue: Characteristic.TargetHeatingCoolingState.AUTO,
            })
            .on(CharacteristicEventTypes.GET, this.getTargetHeatingCoolingState.bind(this))
            // .on(CharacteristicEventTypes.SET, this.setTargetHeatingCoolingState.bind(this))
        ;

        return this.thermostatService;
    }

    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getTargetTemperature(callback)
    {
        this.log('get comfort temperature');

        callback(null, this.state.targetTemperature);
    }

    /**
     *
     * @param {number} value
     * @param {function(null|Error)} callback
     */
    setTargetTemperature(value, callback)
    {
        this.log('set comfort temperature: ' + value);

        this.setTemperature(value,
            /**
             *
             * @param {null|Error} err
             */
            (err) =>
            {
                callback(err);

                // update current heating/cooling state
                this.getCurrentHeatingCoolingState((err2, state) =>
                {
                    this.thermostatService.getCharacteristic(Characteristic.CurrentHeatingCoolingState).updateValue(state);
                });
            });
    }

    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getCurrentTemperature(callback)
    {
        this.log('get current temperature');

        this.refreshTemperatureState(
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            (err, state) =>
            {
                this.log('refreshTemperatureState callback', err, this.state.insideTemperature);
                callback(err, this.state.insideTemperature);
            });
    }

    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getCurrentHeatingCoolingState(callback)
    {
        let state = Characteristic.CurrentHeatingCoolingState.OFF;

        let difTemperature = this.state.targetTemperature - this.state.insideTemperature;
        if(difTemperature > 1)
            state = Characteristic.CurrentHeatingCoolingState.HEAT;
        else if(difTemperature < -1)
            state = Characteristic.CurrentHeatingCoolingState.COOL;

        this.log('get current heating cooling state: ' + state + ' ('+this.state.insideTemperature+'->'+this.state.targetTemperature+')');

        callback(null, state);
    }

    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getTargetHeatingCoolingState(callback)
    {
        this.log('get target heating cooling state');

        // set to auto
        callback(null, Characteristic.TargetHeatingCoolingState.AUTO);
    }

    // /**
    //  * @param {number} value
    //  * @param {function(null|Error, number)} callback
    //  */
    // setTargetHeatingCoolingState(value, callback)
    // {
    //     this.log('set target heating cooling state: ' + value);
    //
    //     callback(null);
    // }


    /**
     *
     * @return {Service.TemperatureSensor}
     */
    getOutsideTemperatureService()
    {
        /**
         * TemperatureSensor service
         * @type {Service.TemperatureSensor}
         */
        this.temperatureSensorService = new Service.TemperatureSensor();
        this.temperatureSensorService.setCharacteristic(Characteristic.Name, 'Outside temperature');

        this.temperatureSensorService.getCharacteristic(Characteristic.CurrentTemperature)
            .on(CharacteristicEventTypes.GET, this.getCurrentOutsideTemperature.bind(this))
        ;

        return this.temperatureSensorService;
    }

    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getCurrentOutsideTemperature(callback)
    {
        this.log('get current outside temperature');

        this.refreshTemperatureState(
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            (err, state) =>
            {
                this.log('refreshTemperatureState callback', err, this.state.outsideTemperature);
                callback(err, this.state.outsideTemperature);
            });
    }


    /**
     *
     * @return {Service.FilterMaintenance}
     */
    getFilterService()
    {
        /**
         * FilterMaintenance service
         * @type {Service.FilterMaintenance}
         */
        this.filterService = new Service.FilterMaintenance();

        this.filterService.setCharacteristic(Characteristic.Name, 'Filter');
        this.filterService.getCharacteristic(Characteristic.FilterLifeLevel).on(CharacteristicEventTypes.GET, this.getFilterLifeLevel.bind(this));
        this.filterService.getCharacteristic(Characteristic.FilterChangeIndication).on(CharacteristicEventTypes.GET, this.getFilterChangeIndication.bind(this));
        this.filterService.getCharacteristic(Characteristic.ResetFilterIndication).on(CharacteristicEventTypes.SET, this.setResetFilterIndication.bind(this));

        return this.filterService;
    }
    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getFilterLifeLevel(callback)
    {
        this.log('get filter life level');

        this.refreshFilterState((err, state) =>
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            {
                this.log('refreshFilterState callback', err, this.state.filterOperatingHours);

                let filterLifeLevel = Math.round((this.state.filterOperatingHours / this.maxFilterOperatingHours) * 100);
                callback(err, filterLifeLevel);
            });
    }

    /**
     *
     * @param {function(null|Error, number)} callback
     */
    getFilterChangeIndication(callback)
    {
        this.log('get filter change indication');

        this.refreshFaults((err, state) =>
            /**
             *
             * @param {null|Error} err
             * @param {FanState} state
             */
            {
                this.log('refreshFaults callback', err, this.state.replaceFilter);

                let filterChange = this.state.replaceFilter ? Characteristic.FilterChangeIndication.CHANGE_FILTER : Characteristic.FilterChangeIndication.FILTER_OK;
                callback(err, filterChange);
            });
    }


    /**
     *
     */
    setResetFilterIndication()
    {
        this.log('reset filter life level');

        this.resetFilter((err, state) =>
            /**
             *
             * @param err
             * @param state
             */
            {
                this.log('reset confirmed');
            });
    }






    /**
     * Handle connection open to Comfoair
     */
    handleVentilationOpen()
    {
        this.log('Connected to Comfoair');

        this.update();
    }

    /**
     *
     * @param {Error} err
     */
    handleVentilationError(err)
    {
        this.log('Comfoair error: ' + err.message);
    }

    /**
     *
     */
    handleVentilationClose()
    {
        this.log('Disconnected from Comfoair');
    }

    /**
     * Update the states
     */
    update()
    {
        this.log('');
        this.log('Interval update');

        // if(this.ventilation == null && this.debug) {
        //     this.state.insideTemperature += (this.state.targetTemperature - this.state.insideTemperature) / 3;
        //
        //     this.state.power = Math.random() > 0.2;
        //     this.state.speed = Math.round(Math.random() * 3);
        // }

        // this.refreshTemperatureState((err, state) => {
        //     this.log('Inside temperature: ' + this.state.insideTemperature);
        // });
        this.refreshLevelState((err, state) => {
            this.log('Power='+this.state.power);
            this.log('Speed: ' + this.state.speed);
        });
        // this.refreshFilterState((err, state) => {
        //     this.log('filterOperatingHours='+this.state.filterOperatingHours);
        //     this.log('FilterLifeLevel='+Math.round((this.state.filterOperatingHours / this.maxFilterOperatingHours) * 100));
        // });
        // this.refreshFaults((err, state) => {
        //     this.log('replaceFilter='+this.state.replaceFilter);
        // });

        this.loggingService.addEntry({time: Math.round(new Date().getTime()/1000), currentTemp: this.state.outsideTemperature, setTemp: this.state.targetTemperature, valvePosition: 0});
    }

    /**
     * Set the ventilation speed
     * @param {number} speed
     * @param {function(null|Error)} callback
     */
    setVentilationSpeed(speed, callback)
    {
        let level = ComfoAirAccessory.getLevel(speed);
        this.log('set level to ' + level);

        if(this.ventilation != null) {
            this.ventilation.setLevel(level, (err, resp) => {
                if(err) {
                    this.log('error setting level to ' + level);
                } else {
                    this.log('confirmation set level ('+level+')');

                    // update state
                    if(speed > 0)
                        this.state.speed = speed;
                    this.state.power = speed > this.offSpeed;
                }

                callback.apply(this, [err]);
            });
        } else {
            if(this.debug) {
                // update state
                if(speed > 0)
                    this.state.speed = speed;
                this.state.power = speed > 0;

                callback.apply(this, [null]);
            } else {
                callback.apply(this, [new Error('Not connected')]);
            }
        }
    }

    /**
     * Set the ventilation level
     * @param {number} temperature
     * @param {function(null|Error)} callback
     */
    setTemperature(temperature, callback)
    {
        this.log('set temperature to ' + temperature);

        if(this.ventilation != null) {
            this.ventilation.setComfortTemperature(temperature,
                /**
                 *
                 * @param {Error} err
                 * @param {setComfortTemperatureResponse} resp
                 */
                (err, resp) => {
                    if(err) {
                        this.log('error setting comfort temperature to ' + temperature);
                    } else {
                        this.log('confirmation set temperature ('+temperature+')');

                        this.state.targetTemperature = temperature;
                    }

                    callback.apply(this, [err]);
                });
        } else {
            if(this.debug) {
                this.state.targetTemperature = temperature;
                callback.apply(this, [null]);
            } else {
                callback.apply(this, [new Error('Not connected')]);
            }
        }
    }

    /**
     *
     * @param {null|function(null|Error, FanState)} callback
     */
    refreshTemperatureState(callback=null)
    {
        if(this.ventilation != null) {
            this.ventilation.getTemperatureStates(

                /**
                 *
                 * @param {Error} err
                 * @param {getTemperatureStatesResponse} resp
                 */
                (err, resp) => {
                    if (err) {
                        this.log(err.message);
                    } else {
                        this.log("Got temperatures:");
                        this.log(resp);

                        // update states
                        this.state.outsideTemperature = resp.payload.outsideAir.value;
                        this.state.insideTemperature = resp.payload.outgoingAir.value;

                        // update Characteristics
                        // this.thermostatService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(ComfoAirAccessory.round(this.state.insideTemperature, 2));
                        // this.temperatureSensorService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(ComfoAirAccessory.round(this.state.outsideTemperature, 2));
                    }

                    if (callback != null)
                        callback.apply(this, [err, this.state]);
                });
        } else {
            if (callback != null) {
                if(this.debug) {

                    // update Characteristics
                    this.thermostatService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(ComfoAirAccessory.round(this.state.insideTemperature, 2));
                    this.temperatureSensorService.getCharacteristic(Characteristic.CurrentTemperature).updateValue(ComfoAirAccessory.round(this.state.outsideTemperature, 2));

                    callback.apply(this, [null, this.state]);
                } else {
                    callback.apply(this, [new Error('Not connected'), this.state]);
                }
            }
        }
    }

    /**
     *
     * @param {null|function(null|Error, FanState)} callback
     */
    refreshLevelState(callback=null)
    {
        let self = this;
        // this.log('this: ', this);
        if(this.ventilation != null) {
            this.ventilation.getVentilationLevel(

                /**
                 *
                 * @param {Error} err
                 * @param {getVentilationLevelResponse} resp
                 */
                (err, resp) => {
                    // this.log('this: ', this);
                    if (err) {
                        this.log(err.message);
                    } else if(resp.valid === false) {
                        this.log(resp.error);
                    } else {
                        this.log("Got levels:");
                        this.log(resp);

                        let level = (resp.payload.currentLevel.value - 1);
                        this.log('level: ' + level);

                        // update states
                        this.state.power = (level > this.offSpeed);
                        this.state.speed = level;


                        // update Characteristics
                        let fanActive = this.state.power;
                        this.fanService.getCharacteristic(Characteristic.Active).updateValue(fanActive);

                        let fanState = this.getFanStateFromState();
                        this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(fanState);

                        let rotationSpeed = this.state.speed;
                        this.fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(rotationSpeed)
                    }

                    if (callback != null)
                        callback.apply(this, [err, this.state]);
                });
        } else {
            if (callback != null) {
                if(this.debug) {

                    // update Characteristics
                    let speed = this.state.speed;
                    let fanActive = this.state.power && speed > 0;
                    this.fanService.getCharacteristic(Characteristic.Active).updateValue(fanActive);

                    let fanState = this.getFanStateFromState();
                    this.fanService.getCharacteristic(Characteristic.CurrentFanState).updateValue(fanState);

                    let rotationSpeed = speed;
                    this.fanService.getCharacteristic(Characteristic.RotationSpeed).updateValue(rotationSpeed)

                    callback.apply(this, [null, this.state]);
                } else {
                    callback.apply(this, [new Error('Not connected'), this.state]);
                }
            }
        }
    }

    /**
     *
     * @param {null|function(null|Error, FanState)} callback
     */
    resetFilter(callback=null)
    {
        if(this.ventilation != null) {
            this.ventilation.reset(
                false,
                false,
                false,
                true,

                /**
                 *
                 * @param {Error} err
                 * @param {resetResponse} resp
                 */
                (err, resp) => {
                    if (err) {
                        this.log(err.message);
                    } else {
                        this.log("Got operating hours:");
                        this.log(resp);

                        // update states
                        this.state.filterOperatingHours = 0;
                        this.state.replaceFilter = false;

                        // update Characteristics
                        let filterChange = (this.state.replaceFilter) ? Characteristic.FilterChangeIndication.CHANGE_FILTER : Characteristic.FilterChangeIndication.FILTER_OK;
                        this.filterService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(filterChange);
                        let filterLifeLevel = Math.round((this.state.filterOperatingHours / this.maxFilterOperatingHours) * 100);
                        this.filterService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(filterLifeLevel);
                    }

                    if (callback != null)
                        callback.apply(this, [err, this.state]);
                });
        } else {
            if (callback != null) {
                if(this.debug) {

                    // update Characteristics
                    this.state.filterOperatingHours = 0;
                    this.state.replaceFilter = false;

                    let filterChange = (this.state.replaceFilter) ? Characteristic.FilterChangeIndication.CHANGE_FILTER : Characteristic.FilterChangeIndication.FILTER_OK;
                    this.filterService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(filterChange);
                    let filterLifeLevel = Math.round((this.state.filterOperatingHours / this.maxFilterOperatingHours) * 100);
                    this.filterService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(filterLifeLevel);

                    callback.apply(this, [null, this.state]);
                } else {
                    callback.apply(this, [new Error('Not connected'), this.state]);
                }
            }
        }
    }

    /**
     *
     * @param {null|function(null|Error, FanState)} callback
     */
    refreshFilterState(callback=null)
    {
        if(this.ventilation != null) {
            this.ventilation.getOperatingHours(

                /**
                 *
                 * @param {Error} err
                 * @param {getOperatingHoursResponse} resp
                 */
                (err, resp) => {
                    if (err) {
                        this.log(err.message);
                    } else {
                        this.log("Got operating hours:");
                        this.log(resp);

                        // update states
                        this.state.filterOperatingHours = resp.payload.filter.value;

                        // update Characteristics
                        let filterLifeLevel = Math.round((this.state.filterOperatingHours / this.maxFilterOperatingHours) * 100);
                        this.filterService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(filterLifeLevel);
                    }

                    if (callback != null)
                        callback.apply(this, [err, this.state]);
                });
        } else {
            if (callback != null) {
                if(this.debug) {
                    this.state.filterOperatingHours += Math.round(Math.random() * this.maxFilterOperatingHours * 0.2);

                    // update Characteristics
                    let filterLifeLevel = Math.round((this.state.filterOperatingHours / this.maxFilterOperatingHours) * 100);
                    this.filterService.getCharacteristic(Characteristic.FilterLifeLevel).updateValue(filterLifeLevel);

                    callback.apply(this, [null, this.state]);
                } else {
                    callback.apply(this, [new Error('Not connected'), this.state]);
                }
            }
        }
    }

    /**
     *
     * @param {null|function(null|Error, FanState)} callback
     */
    refreshFaults(callback=null)
    {
        if(this.ventilation != null) {
            this.ventilation.getFaults(

                /**
                 *
                 * @param {Error} err
                 * @param {getFaultsResponse} resp
                 */
                (err, resp) => {
                    if (err) {
                        this.log(err.message);
                    } else {
                        this.log("Got faults:");
                        this.log(resp);

                        // update states
                        this.state.replaceFilter = resp.payload.replaceFilter.value;

                        // update Characteristics
                        let filterChange = (this.state.replaceFilter) ? Characteristic.FilterChangeIndication.CHANGE_FILTER : Characteristic.FilterChangeIndication.FILTER_OK;
                        this.filterService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(filterChange);
                    }

                    if (callback != null)
                        callback.apply(this, [err, this.state]);
                });
        } else {
            if (callback != null) {
                if(this.debug) {

                    // update Characteristics
                    this.state.replaceFilter = Math.random() > 0.7;

                    let filterChange = (this.state.replaceFilter) ? Characteristic.FilterChangeIndication.CHANGE_FILTER : Characteristic.FilterChangeIndication.FILTER_OK;
                    this.filterService.getCharacteristic(Characteristic.FilterChangeIndication).updateValue(filterChange);

                    callback.apply(this, [null, this.state]);
                } else {
                    callback.apply(this, [new Error('Not connected'), this.state]);
                }
            }
        }
    }

    /**
     *
     * @param {number} speed
     * @return {string}
     */
    static getLevel(speed)
    {
        speed = Math.round(speed);

        let levels = ['away', 'low', 'middle', 'high'];
        if(speed >= 0 && speed < levels.length)
            return levels[speed];

        return levels[0];
    }

    /**
     *
     * @param {string} level
     * @return {number}
     */
    static getSpeed(level)
    {
        let levels = ['away', 'low', 'middle', 'high'];
        return levels.indexOf(level);
    }

    /**
     *
     * @param {number} n
     * @param {number} digits
     * @return {number}
     */
    static round(n, digits)
    {
        let x = Math.pow(10, digits);
        return Math.round(n * x) / x;
    }
}