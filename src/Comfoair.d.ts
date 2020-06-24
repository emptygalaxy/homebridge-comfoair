import {TemperaturesResponse} from "./types/Temperatures";
import {ComfoAirSetResponse} from "./types/ComfoAirResponse";
import {BootloaderVersionResponse} from "./types/BootloaderVersionResponse";
import {FirmwareVersionPayload} from "./types/FirmwareVersion";
import {FanStateResponse} from "./types/FanState";
import {FlapStateResponse} from "./types/FlapState";
import {OperatingHoursResponse} from "./types/OperatingHours";
import {VentilationLevelResponse} from "./types/VentilationLevel";
import {TemperatureStatesResponse} from "./types/TemperatureStates";
import {FaultsResponse} from "./types/Faults";

export interface Comfoair {
    constructor(config?: ComfoairConfig);

    on(event: string, callback: (err?: Error)=>void): void;

    write(command: object, callback: (err: Error|undefined) => void): void;
    runCommand(commandName: string, params: object, callback: (err: Error|undefined, response: object) => void): void;

    getTemperatures(callback: (err: Error|undefined, response: TemperaturesResponse) => void): void;

    setLevel(level: string|number, callback: (err: Error|undefined, response: ComfoAirSetResponse) => void): void;
    setComfortTemperature(temperature: number, callback: (err: Error|undefined, response: ComfoAirSetResponse) => void): void;

    reset(resetFaults: boolean, resetSettings: boolean, runSelfTest: boolean, resetFilterTime: boolean, callback: (err: Error|undefined, ComfoAirSetResponse) => void): void;

    getBootloaderVersion(callback: (err: Error|undefined, response: BootloaderVersionResponse) => void): void;
    getFirmwareVersion(callback: (err: Error|undefined, response: FirmwareVersionPayload) => void): void;
    getFanState(callback: (err: Error|undefined, response: FanStateResponse) => void): void;
    getFlapState(callback: (err: Error|undefined, response: FlapStateResponse) => void): void;
    getOperatingHours(callback: (err: Error|undefined, response: OperatingHoursResponse) => void): void;
    getVentilationLevel(callback: (err: Error|undefined, response: VentilationLevelResponse) => void): void;
    getTemperatures(callback: (err: Error|undefined, response: TemperaturesResponse) => void): void;
    getTemperatureStates(callback: (err: Error|undefined, response: TemperatureStatesResponse) => void): void;
    getFaults(callback: (err: Error|undefined, response: FaultsResponse) => void): void;
}

export interface ComfoairConfig
{
    port: string;
    baud?: number;
}