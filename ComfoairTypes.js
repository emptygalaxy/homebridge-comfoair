/**
 *
 * @typedef {{valid: boolean, payload: {major: {label: string, value: number}, minor: {label: string, value: number}, description: string, deviceName: {label: string, value: string}, beta: {label: string, value: number}}, type: string}} getBootloaderVersionResponse
 */
let getBootloaderVersionResponse = {
    "type": "RES",
    "valid": true,
    "payload": {
        "description": "Bootloader version",
        "major": {
            "value": 3,
            "label": "Version Major"
        },
        "minor": {
            "value": 60,
            "label": "Version Minor"
        },
        "beta": {
            "value": 32,
            "label": "Beta"
        },
        "deviceName": {
            "value": "CA350 luxe",
            "label": "Device name"
        }
    }
};

/**
 *
 * @typedef {{valid: boolean, payload: {major: {label: string, value: number}, minor: {label: string, value: number}, description: string, deviceName: {label: string, value: string}, beta: {label: string, value: number}}, type: string}} getFirmwareVersionResponse
 */
let getFirmwareVersionResponse = {
    "type": "RES",
    "valid": true,
    "payload": {
        "description": "Firmware version",
        "major": {
            "value": 3,
            "label": "Version Major"
        },
        "minor": {
            "value": 60,
            "label": "Version Minor"
        },
        "beta": {
            "value": 32,
            "label": "Beta"
        },
        "deviceName": {
            "value": "CA350 luxe",
            "label": "Device name"
        }
    }
};

/**
 *
 * @typedef {{valid: boolean, payload: {supplyAir: {unit: string, label: string, value: number}, rotationsOutgoing: {unit: string, label: string, value: number}, rotationsSupply: {unit: string, label: string, value: number}, description: string, outgoingAir: {unit: string, label: string, value: number}}, type: string}} getFanStateResponse
 */
let getFanStateResponse = {
    "type": "RES",
    "valid": true,
    "payload": {
        "description": "Fan state",
        "supplyAir": {
            "value": 35,
            "label": "Supply air",
            "unit": "%"
        },
        "outgoingAir": {
            "value": 35,
            "label": "Outgoing air",
            "unit": "%"
        },
        "rotationsSupply": {
            "value": 1138,
            "label": "Rotations supply",
            "unit": "rpm"
        },
        "rotationsOutgoing": {
            "value": 1120,
            "label": "Rotations outgoing",
            "unit": "rpm"
        }
    }
};

/**
 *
 * @typedef {{valid: boolean, payload: {bypass: {unit: string, label: string, value: number}, preheatMotorCurrent: {unit: string, label: string, value: number}, preheat: {label: string, value: string}, bypassMotorCurrent: {unit: string, label: string, value: number}, description: string}, type: string}} getFlapStateResponse
 */
let getFlapStateResponse = {
    "type": "RES",
    "valid": true,
    "payload": {
        "description": "Flap state",
        "bypass": {
            "value": 0,
            "label": "Bypass",
            "unit": "%"
        },
        "preheat": {
            "value": "Unknown",
            "label": "Preheat"
        },
        "bypassMotorCurrent": {
            "value": 0,
            "label": "Bypass Motor Current",
            "unit": "A"
        },
        "preheatMotorCurrent": {
            "value": 0,
            "label": "Preheat Motor Current",
            "unit": "A"
        }
    }
};

/**
 *
 * @typedef {{valid: boolean, payload: {filter: {unit: string, label: string, value: number}, high: {unit: string, label: string, value: number}, away: {unit: string, label: string, value: number}, middle: {unit: string, label: string, value: number}, low: {unit: string, label: string, value: number}, preHeating: {unit: string, label: string, value: number}, description: string, frostProtection: {unit: string, label: string, value: number}, bypassOpen: {unit: string, label: string, value: number}}, type: string}} getOperatingHoursResponse
 */
let getOperatingHoursResponse = {
    "type": "RES",
    "valid": true,
    "payload": {
        "description": "Operating hours",
        "away": {
            "value": 13492,
            "label": "away",
            "unit": "h"
        },
        "low": {
            "value": 12833,
            "label": "low",
            "unit": "h"
        },
        "middle": {
            "value": 7699,
            "label": "middle",
            "unit": "h"
        },
        "frostProtection": {
            "value": 662,
            "label": "frost protection",
            "unit": "h"
        },
        "preHeating": {
            "value": 0,
            "label": "preheating",
            "unit": "h"
        },
        "bypassOpen": {
            "value": 10008,
            "label": "bypass open",
            "unit": "h"
        },
        "filter": {
            "value": 1825,
            "label": "filter",
            "unit": "h"
        },
        "high": {
            "value": 1068,
            "label": "high",
            "unit": "h"
        }
    }
};

/**
 *
 * @typedef {{valid: boolean, payload: {supplyFanRunning: {label: string, value: boolean}, exhaustAway: {unit: string, label: string, value: number}, supplyCurrent: {unit: string, label: string, value: number}, supplyAway: {unit: string, label: string, value: number}, description: string, supplyHigh: {unit: string, label: string, value: number}, exhaustHigh: {unit: string, label: string, value: number}, exhaustMiddle: {unit: string, label: string, value: number}, supplyLow: {unit: string, label: string, value: number}, currentLevel: {label: string, value: number}, supplyMiddle: {unit: string, label: string, value: number}, exhaustCurrent: {unit: string, label: string, value: number}, exhaustLow: {unit: string, label: string, value: number}}, type: string, error: string}} getVentilationLevelResponse
 */
let getVentilationLevelResponse = {
    "type": "RES",
    "valid": true,
    "error": "",
    "payload": {
        "description": "Get ventilation levels",
        "exhaustAway": {
            "value": 15,
            "label": "Exhaust fan level away",
            "unit": "%"
        },
        "exhaustLow": {
            "value": 35,
            "label": "Exhaust fan level low",
            "unit": "%"
        },
        "exhaustMiddle": {
            "value": 50,
            "label": "Exhaust fan level middle",
            "unit": "%"
        },
        "supplyAway": {
            "value": 15,
            "label": "Supply fan level away",
            "unit": "%"
        },
        "supplyLow": {
            "value": 35,
            "label": "Supply fan level low",
            "unit": "%"
        },
        "supplyMiddle": {
            "value": 50,
            "label": "Supply fan level middle",
            "unit": "%"
        },
        "exhaustCurrent": {
            "value": 15,
            "label": "Current exhaust fan level",
            "unit": "%"
        },
        "supplyCurrent": {
            "value": 15,
            "label": "Current supply fan level",
            "unit": "%"
        },
        "currentLevel": {
            "value": 1,
            "label": "Current ventilation level",
        },
        "supplyFanRunning": {
            "value": true,
            "label": "Supply fan is running"
        },
        "exhaustHigh": {
            "value": 70,
            "label": "Exhaust fan level high",
            "unit": "%"
        },
        "supplyHigh": {
            "value": 70,
            "label": "Exhaust fan level high",
            "unit": "%"
        }
    }
};

/**
 *
 * @typedef {{valid: boolean, payload: {groundHeatExchanger: {unit: string, label: string, value: number}, supplyAir: {unit: string, label: string, value: number}, cookerHood: {unit: string, label: string, value: number}, outsideAir: {unit: string, label: string, value: number}, exhaustAir: {unit: string, label: string, value: number}, description: string, outgoingAir: {unit: string, label: string, value: number}, sensorConnected: {label: string, value: Array}, comfort: {unit: string, label: string, value: number}, preheating: {unit: string, label: string, value: number}}, type: string}} getTemperaturesResponse
 */
let getTemperaturesResponse = {
    "type": "RES",
    "valid": true,
    "payload": {
        "description": "Temperatures",
        "comfort": {
            "value": 21,
            "label": "comfort",
            "unit": "°C"
        },
        "outsideAir": {
            "value": 11,
            "label": "outside air",
            "unit": "°C"
        },
        "supplyAir": {
            "value": 20.5,
            "label": "supply air",
            "unit": "°C"
        },
        "outgoingAir": {
            "value": 19.5,
            "label": "outgoing air",
            "unit": "°C"
        },
        "exhaustAir": {
            "value": 11.5,
            "label": "exhaust air",
            "unit": "°C"
        },
        "sensorConnected": {
            "value": [],
            "label": "sensor connected"
        },
        "groundHeatExchanger": {
            "value": 0,
            "label": "ground heat exchanger",
            "unit": "°C"
        },
        "preheating": {
            "value": 0,
            "label": "preheating",
            "unit": "°C"
        },
        "cookerHood": {
            "value": 0,
            "label": "cooker hood",
            "unit": "°C"
        }
    }
};

/**
 *
 * @typedef {{valid: boolean, payload: {supplyAir: {unit: string, label: string, value: number}, outsideAir: {unit: string, label: string, value: number}, exhaustAir: {unit: string, label: string, value: number}, description: string, outgoingAir: {unit: string, label: string, value: number}}, type: string}} getTemperatureStatesResponse
 */
let getTemperatureStatesResponse = {
    "type": "RES",
    "valid": true,
    "payload": {
        "description": "Temperature states",
        "outsideAir": {
            "value": 11,
            "label": "outside air",
            "unit": "°C"
        },
        "supplyAir": {
            "value": 20.5,
            "label": "supply air",
            "unit": "°C"
        },
        "outgoingAir": {
            "value": 19,
            "label": "outgoing air",
            "unit": "°C"
        },
        "exhaustAir": {
            "value": 11.5,
            "label": "exhaust air",
            "unit": "°C"
        }
    }
};

/**
 *
 * @typedef {{valid: boolean, payload: {currentErrorE: {label: string, value: number}, antepenultimateErrorAHigh: {label: string, value: number}, penultimateErrorA: {label: string, value: string}, currentErrorA: {label: string, value: string}, penultimateErrorE: {label: string, value: number}, antepenultimateErrorA: {label: string, value: string}, lastErrorEA: {label: string, value: number}, description: string, antepenultimateErrorE: {label: string, value: number}, lastErrorE: {label: string, value: number}, penultimateErrorEA: {label: string, value: number}, currentErrorAHigh: {label: string, value: number}, lastErrorA: {label: string, value: string}, replaceFilter: {label: string, value: boolean}, antepenultimateErrorEA: {label: string, value: number}, lastErrorAHigh: {label: string, value: number}, penultimateErrorAHigh: {label: string, value: number}, currentErrorEA: {label: string, value: number}}, type: string}} getFaultsResponse
 */
let getFaultsResponse = {
    "type": "RES",
    "valid": true,
    "payload": {
        "description": "Operating faults",
        "currentErrorA": {
            "value": "A0",
            "label": "current error A"
        },
        "currentErrorE": {
            "value": 0,
            "label": "current error E"
        },
        "lastErrorA": {
            "value": "A0",
            "label": "last error A"
        },
        "lastErrorE": {
            "value": 0,
            "label": "last error E"
        },
        "penultimateErrorA": {
            "value": "A0",
            "label": "penultimate error A"
        },
        "penultimateErrorE": {
            "value": 0,
            "label": "penultimate error E"
        },
        "antepenultimateErrorA": {
            "value": "A0",
            "label": "antepenultimate error A"
        },
        "antepenultimateErrorE": {
            "value": 0,
            "label": "antepenultimate error E"
        },
        "replaceFilter": {
            "value": true,
            "label": "replace filter"
        },
        "currentErrorEA": {
            "value": 0,
            "label": "current error EA"
        },
        "lastErrorEA": {
            "value": 0,
            "label": "last error EA"
        },
        "penultimateErrorEA": {
            "value": 0,
            "label": "penultimate error EA"
        },
        "antepenultimateErrorEA": {
            "value": 0,
            "label": "antepenultimate error EA"
        },
        "currentErrorAHigh": {
            "value": 0,
            "label": "current error A high"
        },
        "lastErrorAHigh": {
            "value": 0,
            "label": "last error A high"
        },
        "penultimateErrorAHigh": {
            "value": 0,
            "label": "penultimate error A high"
        },
        "antepenultimateErrorAHigh": {
            "value": 0,
            "label": "antepenultimate error A high"
        },
    }
};

/**
 *
 * @typedef {{type: string}} setLevelResponse
 */
let setLevelResponse = {
    "type": "ACK"
};

/**
 *
 * @typedef {{type: string}} setComfortTemperatureResponse
 */
let setComfortTemperatureResponse = {
    "type": "ACK"
};

/**
 *
 * @typedef {{type: string}} setVentilationLevelResponse
 */
let setVentilationLevelResponse = {
    "type": "ACK"
};

/**
 *
 * @typedef {{type: string}} resetResponse
 */
let resetResponse = {
    "type": "ACK"
};