import _ from 'lodash';
import { Socket } from 'net';
import { v4 as uuidV4 } from 'uuid';

/**
 * TcipKissSocket - A KISS over TCIP client module
 *
 * This module is a client library for KISS over TCIP connections. It has an object-oriented
 * interface which contains methods to connect and disconnect from a server, like Direwolf
 * and to read and write lines on the connection.
 *
 * @emits {event} socketError
 * @emits {event} socketEnd
 * @emits {event} data
 * @emits {event} packet
 */
const DISCONNECT_EVENTS: string[] = ['destroy', 'end', 'close', 'error', 'timeout'];
const CONNECT_EVENTS: string[] = ['connect', 'ready'];

export class KissTcipSocket extends Socket {
    // not a fan of this... emit events instead? build it out to be a wrapper around null/readable/writable?
    private _isSocketConnected: boolean;

    /**
     * Initializes a new JS-APRS-IS socket. Takes two mandatory arguments,
     * the host and port to connect to and your client's callsign, and one or more
     * optional named options:
     *
     * @param {string} host - APRS-IS server to connect to.
     * @param {number} port - Port number of the APRS-IS server to connect to.
     * @param {string | number} [id=uuidV4()] - A unique id for the application.  This is not required, but is here for convenience.
     *
     * @example let connection = new IS('aprs.server.com', 8001);
     * @example let connection = new IS('aprs.server.com', 8001, 12345);
     * @example let connection = new IS('aprs.server.com', 8001, '5c257582-265e-481f-9859-5f7e23c02e72');
     * @example let connection = new IS('aprs.server.com', 8001, '5c257582-265e-481f-9859-5f7e23c02e72', true);
    */
    // Don't provide multiple constructors.  Passing undefined parameters is annoying, but ideally, most, if not all
    // parameters should be used anyway.
    constructor(public host: string
            , public port: number
            , public id: string | number = uuidV4() // This is odd at best... leave it for now
            , public isTransmitEnabled: boolean = false
            ) {
        super();

        this._isSocketConnected = false;
        this.setNoDelay(false);
        this.setEncoding('hex');

        // TODO: Do we want to throw errors if the host or port are null?

        this.on('data', (rawData: string) => {
            let data: RegExpMatchArray | null = rawData.match(/.{2}/g);

            if(data && data.length > 0) {
                // Remove the beginning c0 char
                if(_.head(data) == "c0") {
                    data.shift();
                }

                // Remove the ending c0 char
                if(_.last(data) == "c0") {
                    data.pop();
                }

                // Convert all other hex bytes to chars and join them as a string
                this.emit("packet", _.join(_.map(data, (x) => {
                        return String.fromCharCode(parseInt(x, 16));
                    })
                    , ''
                ));
            }
        });

        DISCONNECT_EVENTS.forEach((e) => {
            this.on(e, () => {
                // Tested, but does not show up in reports as such.
                this._isSocketConnected = false;
            });
        });

        CONNECT_EVENTS.forEach((e) => {
            this.on(e, () => {
                this._isSocketConnected = true;
            });
        });
    }

    /**
     * Connects to the server.
     *
     * TODO: reconnects?  are we really interested?
     *
     * @example connection.connect()
     */
    public connect(callback?: any): any {
        super.connect(this.port, this.host, () => {
            if(callback) {
                callback();
            }
        });

        //return this;

        /*
        ##    *  Need to send on initial connect the following logon line:
        ##      user callsign pass passcode vers appname versionnum rest_of_line
        ##
        ##      callsign = login callsign-SSID
        ##      passcode = login passcode per APRS-IS algorithm, -1 = read-only
        ##      appname = application name (1 word)
        ##      versionnum = application version number (no spaces)
        ##      rest_of_line = server command if connecting to a port that supports commands (see Server Commands)
        ##
        ##      (appname and versionnum should not exceed 15 characters)
        ##
        ##
        ##    * Need to recognize both TCPIP and TCPXX as TCP/IP stations
        ##    * Need to provide a means to perform the user validation. This can either be a user entered password,
        ##      or a client program can automatically figure out the password given the callsign.
        ##      If the later is used, it is the client programmer's responsibility to be certain that non-amateurs
        ##      are not given registrations that can validate themselves in APRS-IS.
        ##    * Probably a good idea to perform some feedback about the limitations of TCPIP without a registration number.
        */
    }

    /**
     * Disconnects from the server.
     * Wrapper method for net.Socket.end() method.
     *
     * TODO: deprecate and implement end instead.
     *
     * @example connection.disconnect();
     */
    public disconnect(callback?: any): any {
        return super.end("", () => {
            if(callback) {
                callback();
            }
        });
    }

    /**
     * @param {string} packet - packet already in KISS format.
     */
    public send(packet: string) {
        if(this.isTransmitEnabled && this._isSocketConnected == true) {
            console.log(packet)

            const buffer = Buffer.from(packet, 'ascii')
            console.log(buffer)

            this.write(buffer);

            // TODO: Emit sent
        }
    }

    /**
     * Transmits a line (typically an APRS packet) to the APRS-IS. The line
     * should be a complete packet but WITHOUT the <CR><LF> separator
     * used on the APRS-IS.
     *
     * @param {string} line - Packet/message to send with <CR><LF> delimiter.

    public sendLine(line: string): void {
        if(this._isSocketConnected === false) {
            throw new Error('Socket not connected.');
        }

        // TODO: do we care about format validation?
        // Trusting the calling appliation to handle this appropriately for now.
        const data = `${line}${MESSAGE_DELIMITER}`;

        // Does it make sense to have a 'sending' and 'data' event?
        this.emit('sending', data);
        this.emit('data', data);

        // TODO: use callback and emit 'sent' and data events
        this.write(data, 'utf8');
    }
    */

    /**
     * In a perfect world, this tells whether the socket is currently connected.
     *
     * @returns {boolean} - True if connected, otherwise false.
     *
     * @example connection.isConnected()
     */
    public isConnected(): boolean {
        // use socket.writeable instead?
        return this._isSocketConnected === true;
    }

    private emitPackets(msgs: string[]) {
        msgs.forEach(msg => {
            this.emit("packet", msg)
        });
    }
};
