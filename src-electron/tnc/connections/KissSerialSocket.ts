import { SerialPort } from "serialport";
import { TerminalSettings } from "../configurations/TerminalSettings";
import { v4 as uuidV4 } from 'uuid';

const DISCONNECT_EVENTS: string[] = ['destroy', 'end', 'close', 'error', 'timeout'];
const CONNECT_EVENTS: string[] = ['open', 'connect', 'ready'];

export class KissSerialSocket extends SerialPort {
    private _id: string | number;
    private _isSocketConnected: boolean;
    private _options: TerminalSettings;
    private _pipe: any;
    private _pipeListener: any = null;

    constructor(options: TerminalSettings
            , public isTransmitEnabled: boolean = false
            , openCallback?: any) {    // TODO: Any needs to be specific here
        super(options, openCallback);

        //this.setEncoding(options.charset);
        this.setEncoding('hex');

        this._isSocketConnected = false;

        this._id = options.id ?? uuidV4();
        this._options = options;

        let _bufferedData = ''
        this.on('data', function(data: Buffer) {
            _bufferedData += data;

            let msgs = _bufferedData.split("c0");

            if(_bufferedData.endsWith('c0')) {
                _bufferedData = '';
            } else {
                _bufferedData = msgs.pop() ?? '';
            }

            if(msgs.length > 0) {
                msgs.forEach((m) => {
                    if(!!m && m != '') {
                        let rawData: RegExpMatchArray | null = m.match(/.{2}/g);

                        if(rawData && rawData.length > 0) {
                            // Remove the beginning c0 char
                            if(rawData[0] == "c0") {
                                rawData.shift();
                            }

                            // Remove the ending c0 char
                            if(rawData[rawData.length - 1] == "c0") {
                                rawData.pop();
                            }

                            // Convert all other hex bytes to chars and join them as a string and emit it
                            this.emit("packet", rawData.map(x => String.fromCharCode(parseInt(x, 16))).join(''));
                        }
                    }
                });
            }
        });

        DISCONNECT_EVENTS.forEach((e) => {
            this.on(e, () => {
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

    /**
     * @param {string} packet - packet already in KISS format.
     */
    public send(packet: string) {
        if(this.isTransmitEnabled && this._isSocketConnected == true) {
            const buffer = Buffer.from(packet, 'ascii');

            this.write(buffer, this._options.charset, err => {
                if(err) {
                    throw err;
                } else {
                    this.emit('sent', `${packet}`);
                }
            });
        }
    }

    public override close(callback?: any | undefined, disconnectError?: Error | null): void {   // TODO: Any needs to be specific here
        if(this.isOpen) {
            super.close(callback, disconnectError);
        }

        // clear internal data listener
        if(this._pipeListener != null) {
            this._pipe.removeListener('data', this._pipeListener)
        }
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
