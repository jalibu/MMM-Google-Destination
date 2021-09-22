# MMM-Google-Destination

[![version](https://img.shields.io/github/package-json/v/jalibu/MMM-Google-Destination)](https://github.com/jalibu/MMM-Google-Destination/releases) [![Known Vulnerabilities](https://snyk.io/test/github/jalibu/MMM-Google-Destination/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jalibu/MMM-Google-Destination?targetFile=package.json)

A module to show the quickest route to a specified destination for the [MagicMirror²](https://magicmirror.builders/) platform.

Contribution welcome.

#### Support

If you like this module and want to thank, please rate this repository with a star or buy me a coffee :-)

<a href="https://www.buymeacoffee.com/jalibu" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Beer" style="height: 45px !important;width: 180px !important;" ></a>

## Features

tbd

### Demo

![image](https://user-images.githubusercontent.com/25933231/133927108-4310d652-175b-4298-9214-c513544b3019.png)

## Installing the Module

1. Navigate to the `MagicMirror/modules` directory and execute the following command

   ```sh
   git clone https://github.com/jalibu/MMM-Google-Destination.git
   ```

2. Get your [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key).

3. Add the module configuration into the `MagicMirror/config/config.js` file (sample configuration):

   ```javascript
   {
   	module: "MMM-Google-Destination",
   	position: "top_left",
   	config: {
		updateIntervalInSeconds: 60,
		apiKey: "YOUR_API_KEY",
		height: 400,
		width: 400,
		start: 'Heidelberg',
		destination: 'Mainz',
		expectedDurationInMinutes: null,
		routeColor: '#0088FF'
   	}
   }
   ```

### Options

| Option                    | Description                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `updateIntervalInSeconds` | How often should the route be recalculated?. <br><br>**Type:** `int` <br> **Default value:** `60` |

## Contribution and Development

This module is written in TypeScript and compiled with Rollup.  
The source files are located in the `/src` folder.
Compile target files with `npm run build`.

Contribution for this module is welcome!

## Thanks to

-

# MMM-Google-Destination
