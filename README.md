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
    * Restore to size, screen and location on start
    * Output window styling? https://github.com/chinchang/screenlog.js
* Maps
    * Make maps a plugin
    * Trails
    * Rotated markers
    * Overlay orientation [ center, lower left, lower right ] to improve recognizability on some symbols
    * Options
        * Number of points for a map?
        * Layers
            * Default
            * User configured
            * Pluggable?
        * Weather station data layers
        * Radar
        * NWS watches/warnings
        * Show trails
        * Restore location and zoom level when switching screens
        * Show labels
        * Station info panel - see aprs.fi
    * Heat maps on zoom out (aprs.fi)
    * Remove old position reports
    * Clear all reports
    * Helpful plugins
        * Offline - [outdated] https://github.com/tbicr/OfflineMap
        * Search - https://github.com/stefanocudini/leaflet-search
        * Realtime framework - https://github.com/perliedman/leaflet-realtime
        * Leaflet plugins - https://github.com/shramov/leaflet-plugins
        * Context menu - [outdated] https://github.com/aratcliffe/Leaflet.contextmenu

    * BUGS:
        * Repeater icons may have multiple locations with the same callsign
* Redundant packet filtering
* Messaging
* TNC
    * User defined commands
    * KISS
* Optimizations
    * Bacon/Kefir?

# Copyright Info
## Symbols
* Most symbols are derived from https://github.com/hessu/aprs-symbols
* Primary Table
    * Train engine - https://iconscout.com/icon/locomotive-engine-railway-steam-train-emoj-symbol
    * House logos are color modified
* Secondary Table
    * Originals from http://www.aprs.org
        * Blowing Snow
        * Girl Scout
        * Ham Store
        * Pharmacy
        * Rain/Drizzle
        * Skywarn&reg;o
        * Small Circle
        * Wallcloud
    * Originals derived from ?
        * Obstruction
        * Workzone
* Overlays
    * All are original
