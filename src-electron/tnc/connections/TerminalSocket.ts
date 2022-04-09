import _ from "lodash"
import { v4 as uuidV4 } from 'uuid'

import { SerialPort } from 'serialport'
import { DelimiterParser } from '@serialport/parser-delimiter'
import { TerminalSettings } from '../configurations/TerminalSettings'

export class TerminalSocket extends SerialPort {
    private _pipe: any
    private _options: TerminalSettings
    private _id: string | number

    // TODO: override callback
    constructor(options: TerminalSettings, openCallback?: any) {    // TODO: Any needs to be specific here
        super(options, openCallback)

        this._id = options.id ?? uuidV4()
        this._options = options
        this._pipe = this.pipe(new DelimiterParser({ delimiter: this._options.messageDelimeter }))

        this.on('open', (err) => {
            if (err)
                throw err

            _.each(this._options.initCommands, (command: string) => {
                this.sendCommand(command)
            })

            this.sendCommand(this._options.myCallCommand)
        })

        this._pipe.on('data', (data: string) => {
            this.emit('packet', data.toString().trim())
        })

        // TODO: Callback
    }

    public get id(): string | number {
        return this._id
    }

    public sendCommand(command: string, callback?: any) {   // TODO: Callback
        this.write(`${command}${this._options.messageDelimeter}`, this._options.charset, err => {
            if(err) {
                throw err
            } else {
                this.emit('sent', `${command}`)
            }
        })
    }

    public sendMyCallCommand(callback?: any) {
        if(this._options.myCallCommand != null
                && this._options.myCallCommand.trim().length > 0
                && this._options.callsign != null
                && this._options.callsign.trim().length > 0
                ) {
            this.sendCommand(this._options.myCallCommand, callback)
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

    public override close(callback?: any | undefined, disconnectError?: Error | null): void {   // TODO: Any needs to be specific here
        try {
            this.runExitCommands()
        } finally {
            setTimeout(() => {
                super.close(callback, disconnectError)
            }, 1000)
        }
    }

    private runExitCommands() { // TODO: Callback
        try {
            _.forEach(this._options.exitCommands, (command: string) => {
                    this.sendCommand(command)
                })
        } catch (err) {
            throw err;
        }

        return
    }
}
