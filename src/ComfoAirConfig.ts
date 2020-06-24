import {AccessoryConfig} from 'homebridge/lib/server';

export interface ComfoAirConfig extends AccessoryConfig
{
    debug: boolean;
    info: boolean;

    port: string;
    baudRate?: number;

    deviceName: string;
    deviceManufacturer?: string;
    deviceModel?: string;
    deviceSerial?: string;

    minTemperature?: number;
    maxTemperature?: number;

    maxFilterOperatingHours?: number;

    updateInterval?: number;
    setOffToLow: boolean;

    historyLength?: number;
}