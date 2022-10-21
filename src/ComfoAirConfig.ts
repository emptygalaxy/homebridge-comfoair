import type {AccessoryConfig} from 'homebridge';

export interface ComfoAirConfig extends AccessoryConfig {
  debug?: boolean;
  info?: boolean;

  // Required
  port?: string;
  baudRate?: number;

  // Required
  deviceName?: string;
  deviceManufacturer?: string;
  deviceModel?: string;
  deviceSerial?: string;

  minTemperature?: number;
  maxTemperature?: number;

  maxFilterOperatingHours?: number;

  updateInterval?: number;

  // Required
  setOffToLow?: boolean;

  historyLength?: number;
}
