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

# TODO
RxDB - node-websql adapter
