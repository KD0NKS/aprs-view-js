# aprs-view-js

APRS is a registered trademark Bob Bruninga, WB4APR.

This is intended to be a fairly lightweight, cross platform, grapical APRS client.  Currently, this is a read-only client.  The only ability it has to send data is a login packet to the server.  There are certain packets that cannot be handled by the client, which is a limitation of the js-aprs-fap library.

## Features
* Ability to connect to either an aprsc or Jav-APRS-IS server.
* See raw data packets in output window.

## Contributing
If you would like to contribute, please feel free to fork the repo and add pull requests!

## Suggestions?
Please feel free to create a feature request in the issues.

## Building
Clone the project.

Because of Vue, you must use yarn to install dependencies, otherwise you will have depdencency issues.
Install dependencies.
```
yarn install
```

Build the project.
```
yarn run electron:build
```

Run it.
```
yarn run electron:serve
```

TODO:
* UI
    - [ ] Restore to size, screen and location on start
    - [ ] Output window styling? https://github.com/chinchang/screenlog.js
* Maps
    - [ ] Make maps a plugin
    - [ ] Trails
    - [x] Rotated markers
    - [x] Show labels
    - [ ] Properly handle objects - names, not moving stationary objects on duplicate src callsign, etc
    - [x] Heat maps on zoom out (aprs.fi)
    - [x] Remove old position reports
    - Options
        - [x] Point lifetime
        - [ ] Number of points for a map?
        - Layers
            - [ ] Layer Sources - Needs auth inputs
            - [ ] Tile Sources - Needs auth inputs
            - [ ] User defined maps
            - [ ] User defined layers
            - [ ] Radar
            - [ ] NWS watches/warnings
        - [ ] Default
        - [ ] User configured
        - [ ] Pluggable?
        - [ ] Weather station data layers
        - [ ] Radar
        - [ ] NWS watches/warnings
        - [ ] Show trails
        - Location options
            - [ ] Restore location and zoom level when switching screens
            - [ ] Map start coordinates
            - [ ] Map zoom level
            - [ ] Weather station data layers - lots of data can be extracted from weather stations
        - Labels
            - [x] Show labels
            - [ ] Label options
                - Object name
                - Callsign
                - Weather data
        - [ ] Station info panel - see aprs.fi
        - [ ] User defined maps
        - [ ] Track station/Track my station
    - ContextMenu
        - [/] Clear all reports
        - [ ] Set my station position
        - [ ] Create object (low priority also requires proper handling)
    - Helpful plugins
        - [ ] Offline - [outdated] https://github.com/tbicr/OfflineMap
        - [ ] Search - https://github.com/stefanocudini/leaflet-search
        - [ ] Realtime framework - https://github.com/perliedman/leaflet-realtime
        - [ ] Leaflet plugins - https://github.com/shramov/leaflet-plugins
    - [ ] Overlays - https://vue2-leaflet.netlify.app/components/LImageOverlay.html#demo
    - BUGS/ENHANCEMENTS:
        - [ ] Repeater icons may have multiple locations with the same callsign
        - [ ] Weather packets with no locations - if we know the location of the station already, update the id to get the latest when the icon is clicked
        - [ ] Is it possible to rewrite/extend VectorSource in openlayers to accept an observable array of features? https://github.com/openlayers/openlayers/blob/main/src/ol/source/Vector.js
            - This could lead down a rabbit hole where the entire lib needs to be rewritten
            - Collection would likely need to be rewritten - https://github.com/openlayers/openlayers/blob/b7ccb68b02bd936373b1bd1d2f5ca445e1d286e0/src/ol/Collection.js
- [ ] Messaging
- [ ] TNC Support
    - [ ] User defined commands
    - [ ] KISS
- General app settings
    - [ ] Imperial/metric
    - [ ]
- Filters
    - [ ] Heard by my station (no digis)
    - [ ] Station Type
    - [ ] Packet Type
    - [ ] Blocked stations
- Connection Settings
    - [ ] Allow Transmit
- Station Settings
    - [ ] Transmit position interval
    - [ ] Transmit position
- Output Settings
    - [ ] Foreground color
    - [ ] Background color
    - [ ] Font
    - [ ] Amount of data to display

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
