import _ from "lodash"
import { v4 as uuidV4 } from 'uuid'

import { SerialPort } from 'serialport'
import { DelimiterParser } from '@serialport/parser-delimiter'
import { TerminalSettings } from '../configurations/TerminalSettings'

export class TerminalSocket extends SerialPort {
    private _id: string | number
    private _options: TerminalSettings
    private _pipe: any
    private _pipeListener = null

    // TODO: override callback
    constructor(options: TerminalSettings, openCallback?: any) {    // TODO: Any needs to be specific here
        super(options, openCallback)

        this._id = options.id ?? uuidV4()
        this._options = options
        this._pipe = this.pipe(new DelimiterParser({ delimiter: this._options.messageDelimeter }))

        this.on('open', (err) => {
            if (err)
                throw err

            this.sendCommand(this._options.messageDelimeter)

            // TODO: Setup loop that checks for data and executes until all data is drained?

            // Attempt to clear data from pipe
            setTimeout(() => {
                this.flush()
                // TODO: Fix this
                //this._pipeListener = this._pipe.on('data', (data: string) => {
                this._pipe.on('data', (data: string) => {
                    this.emit('packet', data.toString().trim())
                })

                for(let command of this._options.initCommands){
                    this.sendCommand(command)
                }

                this.sendMyCallCommand()
            }, 2000)
        })

        // TODO: Callback
    }

    public get id(): string | number {
        return this._id
    }

    public setCallsign(callsign: string) {
        this._options.callsign = callsign.trim()
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
            this.emit('sent', `${ this._options.myCallCommand.trim() } ${ this._options.callsign.trim() }${ this._options.messageDelimeter }`)
            this.sendCommand(`${ this._options.myCallCommand.trim() } ${ this._options.callsign.trim() }${ this._options.messageDelimeter }`, callback)
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

            //this._pipe.removeListener('data', this._pipeListener)
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
