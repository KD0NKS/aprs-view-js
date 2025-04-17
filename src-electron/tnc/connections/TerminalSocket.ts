import _ from "lodash";
import { v4 as uuidV4 } from 'uuid';

import { DelimiterParser, SerialPort } from 'serialport';
import { TerminalSettings } from '../configurations/TerminalSettings';
import { DataEventTypes } from "../../enums/DataEventTypes";

const DISCONNECT_EVENTS: string[] = ['destroy', 'end', 'close', 'error', 'timeout'];
const CONNECT_EVENTS: string[] = ['open', 'connect', 'ready'];

export class TerminalSocket extends SerialPort {
    private _isSocketConnected: boolean;

    private _id: string | number;
    private _options: TerminalSettings;
    private _pipe: DelimiterParser;
    private _pipeListener: any = null;

    // TODO: override callback
    constructor(options: TerminalSettings, openCallback?: any) {    // TODO: Any needs to be specific here
        super(options, openCallback);

        this._isSocketConnected = false;

        this._id = options.id ?? uuidV4();
        this._options = options;
        this._pipe = this.pipe(new DelimiterParser({ delimiter: this._options.messageDelimeter }));

        this.on('open', (err) => {
            if (err)
                throw err;

            this.sendCommand(this._options.messageDelimeter);

            // Attempt to clear data from pipe
            setTimeout(() => {
                this.flush();

                // Attempt to clear data from pipe
                let flushedData = this.read();
                while(flushedData != null) {
                    flushedData = this.read();
                }

                this._pipeListener = (data) => {
                    this.emit('packet', data.toString().trim());
                }

                for(let command of this._options.initCommands) {
                    this.sendCommand(command);
                }

                this._pipe.on('data', this._pipeListener);

                this.sendMyCallCommand();
            }, 2000);
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

    public get id(): string | number {
        return this._id;
    }

    public get isTransmitEnabled(): boolean {
        return this._options.isTransmitEnabled ?? false;
    }

    public setCallsign(callsign: string) {
        this._options.callsign = callsign.trim();
    }

    public sendCommand(command: string, callback?: any) {   // TODO: Callback
        this.write(`${command}${this._options.messageDelimeter}`, this._options.charset, err => {
            if(err) {
                throw err;
            } else {
                this.emit('sent', `${command}`);
            }
        });
    }

    public sendMyCallCommand(callback?: any) {
        if(this.isOpen
                && this.writable == true
                && this._options.myCallCommand != null
                && this._options.myCallCommand.trim().length > 0
                && this._options.callsign != null
                && this._options.callsign.trim().length > 0
                ) {
            this.emit('sent', `${ this._options.myCallCommand.trim() } ${ this._options.callsign.trim() }${ this._options.messageDelimeter }`);
            this.sendCommand(`${ this._options.myCallCommand.trim() } ${ this._options.callsign.trim() }${ this._options.messageDelimeter }`, callback);
        }
        /*
        else if(this._options.myCallCommand == null
                || this._options.myCallCommand.trim().length == 0) {
            throw('No myCallCommand defined')
        } else if(this._options.callsign == null
                || this._options.callsign.trim().length == 0) {
            throw('No callsign defined')
        }
        */
    }

    /**
     * @param {string} packet - packet already in KISS format.
     */
    public send(packet: string, callback?: any) {
        // TEST CODE FOR SENDING PACKET
        console.log("Sending packet from terminal socket");

        if(this._isSocketConnected == true
                && this.writable
                && this._options.isTransmitEnabled) {
            this.write(`${this._options.messageDelimeter}`);

            if(this._options.converseCommand != null && this._options.converseCommand !== undefined && this._options.converseCommand.trim() != "") {
                console.log(`Sending convserse command: ${this._options.converseCommand}`);
                this.sendCommand(`${this._options.messageDelimeter}`);
                this.emit(DataEventTypes.SENT, `${this._options.messageDelimeter}`);
                this.sendCommand(`${this._options.converseCommand}`);
                this.emit(DataEventTypes.SENT, `${this._options.converseCommand}`);
                setTimeout(() => {}, 1000);
            }

            this.write(`${packet}\r`, this._options.charset, err => {
                if(err) {
                    console.log(err);
                    throw err;
                } else {
                    console.log(`Sent packet ${packet}\r\n`);
                    this.emit('sent', `${packet}`);
                    setTimeout(() => {}, 1000);
                }
            });

            this.write(Buffer.from([0x03]), err => {
                if(err) {
                    throw err;
                }
            });
        }

        if(!!callback) {
            callback()
        }
    }

    public override close(callback?: any | undefined, disconnectError?: Error | null): void {   // TODO: Any needs to be specific here
        try {
            this.runExitCommands();
        } finally {
            if(this.isOpen) {
                setTimeout(() => {
                    super.close(callback, disconnectError);
                }, 1000);
            }

            // clear internal data listener
            if(this._pipeListener != null) {
                this._pipe.removeListener('data', this._pipeListener);
            }
        }
    }

    private runExitCommands() { // TODO: Callback
        try {
            _.forEach(this._options.exitCommands, (command: string) => {
                    this.sendCommand(command);
                })
        } catch (err) {
            throw err;
        }

        return
    }

    /**
     * In a perfect world, this tells whether the socket is currently connected.
     *
     * @returns {boolean} - True if connected, otherwise false.
     *
     * @example connection.isConnected()
     */
    public isConnected(): boolean {
        return this._isSocketConnected === true;
    }
}

