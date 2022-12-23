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
| Property | Description |
|-|-|
| accessory | Must be set to "Comfoair" to identify the plugin |
| name | The name of the accessory that will be displayed in HomeKit |
| manufacturer | The manufacturer of the accessory |
| port | The serial port that the Comfoair system is connected to |
| baudRate | The baud rate of the serial connection (default is 9600)|
| minTemperature | The minimum allowed temperature for the slider in HomeKit |
| maxTemperature |	The maximum allowed temperature for the slider in HomeKit |
| updateInterval |	The interval (in seconds) at which to update the temperature readings |


## Example config.json
```json
{
  "accessories": [
    {
      "accessory": "WHR930",
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
