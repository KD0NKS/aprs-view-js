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

## Building
Clone the project.

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev -m electron
```

### Lint the files

```bash
yarn lint
```

### Format the files

```bash
yarn format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).





https://forum.quasar-framework.org/topic/1870/webpack-alias-in-quasar-conf-js-15/2
https://blog.logrocket.com/building-app-electron-vue/
https://lzomedia.com/blog/building-a-vue-3-desktop-app-with-pinia-electron-and-quasar/
https://blog.logrocket.com/advanced-electron-js-architecture/

https://forum.quasar-framework.org/topic/1870/webpack-alias-in-quasar-conf-js-15/2
