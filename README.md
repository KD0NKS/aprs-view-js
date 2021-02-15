# aprs-view-js

APRS is a registered trademark Bob Bruninga, WB4APR.

## Descritpion
This is intended to be a fairly lightweight, cross platform, grapical APRS client.

## Status
As APRS software is very complex and I'm starting the UI 100% from scratch.  I am currently working to design a decent interface given certain limitations of the framework being used.

## Features
* Ability to connect to either an aprsc or Jav-APRS-IS server.
* See raw data packets in output window.

## Contributing
If you would like to contribute, please feel free to fork the repo and add pull requests!

## Suggestions?
Please feel free to create a feature request in the issues.

## Building
Clone the project.
Install dependencies.
```
npm install
```

Build the project.
```
npm run electron:build
```

Run it.
```
npm run electron:serve
```

TODO:
* UI
    * Fix side menu min width when not full screen
    * Restore to size, screen and location on start
* Maps
    * Make maps a plugin
    * Trails
    * Rotated markers
    * Options
        * Number of points for a map
        * Layers
            * Default
            * User configured
            * Pluggable?
        * Weather station data layers
        * Radar
        * NWS watches/warnings
        * Show trails
        * Restore location and zoom level when switching screens
    * Heat maps on zoom out (aprs.fi)
    * Remove old position reports
    * Clear all reports
* Redundant packet filtering
* Messaging
* TNC
    * User defined commands
    * KISS