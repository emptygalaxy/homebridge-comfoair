// export interface FakeGatoHistoryService {
//   new (displayName: string, subtype: string);
// }

export interface FakeGatoHistory {
  new (
    accessoryType: FakeGatoHistoryAccessoryType,
    accessory,
    optionalParams: OptionalParams
  );
  registerEvents(): void;
  sendHistory(address: number): void;
  addEntry(
    entry:
      | SwitchDoorMotionEntry
      | AquaEntry
      | WeatherEntry
      | RoomEntry
      | ThermoEntry
      | EnergyEntry
  ): void;
}

interface OptionalParams {
  size: number;
  disableTimer: boolean;
  disableRepeatLastData: boolean;
}

interface Entry {
  time: number;
}

interface SwitchDoorMotionEntry extends Entry {
  status: 0 | 1;
}

interface AquaEntry extends Entry {
  waterAmount: number;
  status: 0 | 1;
}

interface WeatherEntry extends Entry {
  temp: number;
  humidity: number;
  pressure: number;
}

interface RoomEntry extends Entry {
  temp: number;
  humidity: number;
  ppm: number;
}

interface ThermoEntry extends Entry {
  currentTemp: number;
  setTemp: number;
  valvePosition: number;
}

interface EnergyEntry extends Entry {
  power: number;
}

interface CustomEntry extends Entry {
  /**
   * Temperature in celcius ( value averaged over 10 minutes )
   */
  temp: number;

  /**
   * humidity in percentage ( value averaged over 10 minutes )
   */
  humidity: number;

  /**
   * pressure ( value averaged over 10 minutes )
   */
  pressure: number;

  /**
   * Current usage in watts ( value averaged over 10 minutes )
   */
  power: number;

  /**
   * Parts per million
   */
  ppm: number;

  /**
   * contact sensor state ( 0 / 1 )
   */
  contact: 0 | 1;
  /**
   * switch status ( 0 / 1 )
   */
  status: 0 | 1;

  /**
   * motion sensor state ( 0 / 1 )
   */
  motion: 0 | 1;
  /**
   * µg/m3
   */
  voc: number;
  /**
   * Temperature in celcius
   */
  setTemp: number;

  /**
   * valvePosition in percentage
   */
  valvePosition: number;
}

type FakeGatoHistoryAccessoryType =
  | 'weather'
  | 'energy'
  | 'room'
  | 'room2'
  | 'door'
  | 'motion'
  | 'switch'
  | 'thermo'
  | 'aqua'
  | 'custom';
