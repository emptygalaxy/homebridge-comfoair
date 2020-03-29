'use strict'



/**
 * @type {Comfoair}
 */
const Comfoair = require('comfoair');


/**
 *
 * @type {Comfoair}
 */
let ventilation = new Comfoair({
    port: '/dev/cu.usbserial-10',
    baud: 9600,
});

ventilation.on('open', () => {
    console.log('Connected to Comfoair :)');
});

ventilation.on('error', (err) => {
    console.log(err);
});
ventilation.on('close', () => {
    console.log('ComfiAir closed');
    process.exit();
});

/**
 *
 * @type {NodeJS.ReadStream}
 */
let standard_input = process.stdin;
standard_input.setEncoding('utf-8');
standard_input.on('data', (data) =>
    /**
     *
     * @param {string} data
     */
    {
        let str = data.split('\n')[0];
        switch(str)
        {
            default:
                break;

            case 'getBootloaderVersion':
                ventilation.getBootloaderVersion((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getBootloaderVersionResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getBootloaderVersion:");
                        console.log(resp);
                    });
                break;

            case 'getFirmwareVersion':
                ventilation.getFirmwareVersion((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getFirmwareVersionResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getFirmwareVersion:");
                        console.log(resp);
                    });
                break;

            case 'getFanState':
                ventilation.getFanState((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getFanStateResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getFanState:");
                        console.log(resp);
                    });
                break;

            case 'getFlapState':
                ventilation.getFlapState((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getFlapStateResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getFlapState:");
                        console.log(resp);
                    });
                break;

            case 'getOperatingHours':
                ventilation.getOperatingHours((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getOperatingHoursResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getOperatingHours:");
                        console.log(resp);
                    });
                break;

            case 'getVentilationLevel':
                ventilation.getVentilationLevel((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getVentilationLevelResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getVentilationLevel:");
                        console.log(resp);
                    });
                break;

            case 'getTemperatures':
                ventilation.getTemperatures((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getTemperaturesResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getTemperatures:");
                        console.log(resp);
                    });
                break;

            case 'getTemperatureStates':
                ventilation.getTemperatureStates((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getTemperatureStatesResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getTemperatureStates:");
                        console.log(resp);
                    });
                break;

            case 'getFaults':
                ventilation.getFaults((err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {getFaultsResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("getFaults:");
                        console.log(resp);
                    });
                break;


            case '0':
            case 'away':
            case '1':
            case 'low':
            case '2':
            case 'middle':
            case '3':
            case 'high':
            case '4':
            case 'auto':
                ventilation.setLevel(str, (err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {setLevelResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("setLevel:");
                        console.log(resp);
                    });
                break;

            case '18':
            case '19':
            case '20':
            case '21':
            case '22':
            case '23':
                ventilation.setComfortTemperature(Number(str), (err, resp) =>
                    /**
                     *
                     * @param {Error} err
                     * @param {setComfortTemperatureResponse} resp
                     */
                    {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        console.log("setComfortTemperature: " + resp);
                    });
                break;

            case 'exit':
                ventilation.close();
                process.exit();
                break;
        }
    });