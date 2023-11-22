# aprs-view-js

APRS is a registered trademark Bob Bruninga, WB4APR.

This is intended to be a fairly lightweight, cross platform, graphical APRS client.  Currently, this is a read-only client.  The only ability it has to send data is a login packet to the server.  There are certain packets that cannot be handled by the client, which is a limitation of the js-aprs-fap library.

aprs-view-js is NOT intended to be run as a web server and would cause many issues and potential system vulnerabilities being run as such.  There are plenty of amazing online APRS clients such as https://aprs.fi.

## Features
* Ability to connect to either an aprsc or Jav-APRS-IS server.
* See raw data packets in output window.

## Contributing
If you would like to contribute, please feel free to fork the repo and add pull requests!

## Suggestions?
Please feel free to create a feature request in the issues.

## Global requirements
Quasar CLI
```bash
npm i -g @quasar/cli
```

## Building
Clone the project.

### Install the dependencies
```bash
yarn install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m electron
```

### Build the app for production
This is an example for building for windows.

```bash
quasar build -m electron -T win32
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

TODO:
* UI
    - [ ] Restore to size, screen and location on start
    - [ ] Output window styling? https://github.com/chinchang/screenlog.js
* Station settings
    - Position
        - [x] Static
        - [ ] Interval - 1 to 30 minutes
        - [ ] GPS - SmartBeacon
* Maps
    - [ ] Make maps a plugin
    - [x] Trails* - There are potential issues
        - https://openlayers.org/workshop/en/vector/draw.html
        - https://gis.stackexchange.com/questions/323992/create-polyline-from-coordinates-array-in-ol-openlayers-5-3-2
        - routes while cool would display more data than is actually transmitted, but is a cool idea: https://gis.stackexchange.com/questions/147617/how-to-draw-route-from-osrm-on-right-road-using-openlayers
    - [x] Rotated markers
    - [x] Show labels
    - [x] Properly handle objects - names, not moving stationary objects on duplicate src callsign, etc
    - [x] Heat maps on zoom out (aprs.fi)
    - [x] Remove old position reports
    - Performance Resources- Ideas for improving
        - https://dev.to/camptocamp-geo/integrating-an-openlayers-map-in-vue-js-a-step-by-step-guide-2n1p
    - Options
        - Map
            - [x] Point lifetime
            - [ ] Number of points for a map?
            - Layers
                - [ ] Layer Sources - Needs auth inputs
                - [ ] Tile Sources - Needs auth inputs
                - [ ] User defined maps
                - [ ] User defined layers
                - [ ] Opacity of layers
                - [ ] User configured
                - [ ] Default - ???
                - [ ] User defined layers
                - [ ] Weather station data layers
                - [ ] Radar
                    - https://openlayers.org/en/latest/examples/wms-time.html
                    - nowCoast
                - [ ] NWS watches/warnings
                    - nowCoast
                - Location options
                    - [ ] Restore location and zoom level when switching screens
                    - [ ] Map start coordinates
                    - [ ] Map zoom level
                    - [ ] Weather station data layers - lots of data can be extracted from weather stations
                - Labels
                    - [x] Show labels
                    - [ ] Label options
                        - [x] Object/Callsign
                        - [ ] Weather data?
        - [ ] Station info panel - see aprs.fi
        - [ ] Track station/Track my station
    - ContextMenu
        - [x] Clear all reports
        - [x] Set my station position
        - [ ] Create object (low priority also requires proper handling)
    - Helpful plugins
        - [ ] Offline - [outdated] https://github.com/tbicr/OfflineMap
        - [ ] Search - https://github.com/stefanocudini/leaflet-search
        - [ ] Realtime framework - https://github.com/perliedman/leaflet-realtime
        - [ ] Leaflet plugins - https://github.com/shramov/leaflet-plugins
    - [ ] Overlays - https://vue2-leaflet.netlify.app/components/LImageOverlay.html#demo
    - BUGS/ENHANCEMENTS (B/E):
        - [x] B - Clearing all markers currently doesn't work properly.  Working with kefir/bacon may help mitigate this
        - [x] B - Items/Objects may have multiple locations with the same callsign
        - [ ] E - Items/Objects may have multiple locations with the same value, this will result in only 1 showing up
        - [ ] E - Weather packets with no locations - if we know the location of the station already, update the id to get the latest when the icon is clicked?
        - [ ] B - Overlays are not allowing newer markers to cover them
        - [ ] E- APRSViewJS used Bacon/Kefir for filtering and packet types, can these be easily utilized to make packets easier to handle
        source/Vector.js
            - Is it possible to rewrite/extend VectorSource in openlayers to accept an observable array of features? https://github.com/openlayers/openlayers/blob/main/src/ol/
            - This could lead down a rabbit hole where the entire lib needs to be rewritten
            - Collection would likely need to be rewritten - https://github.com/openlayers/openlayers/blob/b7ccb68b02bd936373b1bd1d2f5ca445e1d286e0/src/ol/Collection.js
- [ ] Messaging
    - [ ] Receive
    - [ ] Send
    - [ ] ACK
- Control packet support???
- [ ] TNC Support - via js-aprs-tnc
    - [x] User defined commands
    - [ ] KISS
        - [ ] Read - Serial
        - [ ] Write - Serial
        - [x] Read - TCP
        - [ ] Write - TCP
- General app settings
    - [x] Imperial/metric
    - [ ] Themes
        - [x] Dark Theme
        - [ ] Use OS theme?
            - https://medium.com/missive-app/make-your-electron-app-dark-mode-compatible-c23dcfdd0dfa
- Filters
    - [ ] Heard by my station (no digis)
    - [ ] Station Type
    - [ ] Packet Type
    - [ ] Blocked stations
- Connection Settings
    - [x] Allow Transmit - NOTE: This doesn't do anything at the moment
- Station Settings
    - [ ] Transmit position interval
    - [ ] Transmit position
- Output Settings
    - [ ] Clear output
    - [ ] Pin to bottom (auto scrolling)
    - [ ] Foreground color
    - [ ] Background color
    - [ ] Font
    - [ ] Amount of data to display
- [ ] ULS Offline Lookup
Other functionality to consider
- [ ] Digipeating
    - https://blog.aprs.fi/2020/02/how-aprs-paths-work.html
- [ ] IGate
    - https://blog.aprs.fi/2020/02/how-aprs-paths-work.html

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

# Other Notes for Quasar rewrite
https://forum.quasar-framework.org/topic/1870/webpack-alias-in-quasar-conf-js-15/2
https://blog.logrocket.com/building-app-electron-vue/
https://lzomedia.com/blog/building-a-vue-3-desktop-app-with-pinia-electron-and-quasar/
https://blog.logrocket.com/advanced-electron-js-architecture/

https://forum.quasar-framework.org/topic/1870/webpack-alias-in-quasar-conf-js-15/2
