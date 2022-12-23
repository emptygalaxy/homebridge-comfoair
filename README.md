# Homebridge-comfoir
A homebridge plugin that controls ventilation over serial, using the [node-comfoair](https://github.com/coolchip/node-comfoair) library.
It uses [fakegato-history](https://github.com/simont77/fakegato-history) to store and display temperature readings over time in the [Eve app](https://itunes.apple.com/app/elgato-eve/id917695792). 

## Features
- Set ventilation level
- Set target temperature
- Read inside temperature
- Read outside temperature

## Installation
1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-comfoair`
3. Update your configuration file. See sample-config.json in this repository for a sample.

## Configuration
| Property | Type | Description |
|----------|------|-------------|
| `accessory` | string | Must be set to "Comfoair" to identify the plugin |
| `debug` | boolean | Enable debug output |
| `info` | boolean | Enable info output |
| `port` | string | The serial port that the Comfoair system is connected to |
| `baudRate` | number | The baud rate of the serial connection (default is 9600) |
| `deviceName` | string | The name of the device that will be displayed in HomeKit |
| `deviceManufacturer` | string | The manufacturer of the device |
| `deviceModel` | string | The model of the device |
| `deviceSerial` | string | The serial number of the device |
| `minTemperature` | number | The minimum allowed temperature for the ventilation system |
| `maxTemperature` | number | The maximum allowed temperature for the ventilation system |
| `maxFilterOperatingHours` | number | The maximum number of operating hours for the filter |
| `updateInterval` | number | The interval (in seconds) at which to update the temperature readings |
| `setOffToLow` | boolean | Set the ventilation level to low when turning off, else the ventilation will actually set to off/away. |
| `historyLength` | number | The number of history points to store for temperature readings |


## Example config.json
```json
{
  "accessories": [
    {
      "accessory": "ComfoAir",
      "name": "Ventilation",
      "manufacturer": "Comfoair",
      "port": "/dev/ttyUSB0",
      "baudRate": 9600,
      "minTemperature": 15,
      "maxTemperature": 30,
      "updateInterval": 500
    }
  ]
}
```

## Troubleshooting

If you are having issues with the serial connection, try the following:
- Make sure the correct port and baud rate are specified in the configuration.  
- Ensure that the device is properly connected and recognized by the operating system
- Try using a different cable or USB port
- If using a USB to serial adapter, make sure it is compatible with your operating system and properly installed
- Check the device's documentation for any specific troubleshooting steps
