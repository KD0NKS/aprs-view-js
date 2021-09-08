import _ from 'lodash'
import * as crypto from "crypto"
import { IConnection } from "./IConnection"
import { ISSocket } from "js-aprs-is"
import store from "@/store"
import { TerminalConnection, TerminalSettings } from "js-aprs-tnc"

// TODO: Decouple from Vue/Vuex
/**
 * @property { string } name Name of the connection
 * @property { Socket } connection The actual connection reading APRS data
 * @property { ConnectionTypeEnum } connectionType Key value from the ConnectionTypeEnum
 * @property { bool } isEnabled Whether or not the connection is enabled by default
 */
export class Connection implements IConnection {
    public id: string
    public name: string
    public connectionType: string

    public host?: string = null
    public port?: number = null
    public filter?: string = null

    public comPort?: string = null
    public charset?: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex'
    public exitCommands?: string[]
    public messageDelimieter?
    public initCommands?: string[]
    public autoOpen?: boolean
    public baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number
    public dataBits?: 8 | 7 | 6 | 5
    public highWaterMark?: number
    public lock?: boolean
    public stopBits?: 1 | 2
    public parity?: 'none' | 'even' | 'mark' | 'odd' | 'space'
    public rtscts?: boolean
    public xany?: boolean
    public xon?: boolean
    public xoff?: boolean

    private _connection: ISSocket | TerminalConnection
    private _isConnected = false
    private _isEnabled = false
    private DISCONNECT_EVENTS: string[] = ['destroy', 'end', 'close', 'error', 'timeout']
    private CONNECT_EVENTS: string[] = [ 'connect', 'open' ]

    constructor(connection?: Partial<Connection>) {
        this.id = crypto.randomBytes(16).toString('hex')

        if(connection)
            Object.assign(this, connection)

        // TODO: Fix the references to state here.  This should be decoupled from Vue
        if(!connection.connection) {
            if(connection.connectionType == 'IS_SOCKET') {
                this._connection = new ISSocket(
                    this.host
                    , this.port
                    , store.state.stationSettings.callsign
                    , store.state.stationSettings.passcode
                    , this.filter
                    , store.state.connectionService.appId
                    )
            } else if (connection.connectionType == 'SERIAL_TNC') {
                const terminalSettings: TerminalSettings = new TerminalSettings()
                connection.comPort = this.comPort
                terminalSettings.autoOpen = this.autoOpen
                terminalSettings.baudRate = this.baudRate
                terminalSettings.charset = this.charset
                terminalSettings.dataBits = this.dataBits
                terminalSettings.parity = this.parity
                terminalSettings.rtscts = this.rtscts
                terminalSettings.stopBits = this.stopBits
                terminalSettings.messageDelimieter = this.messageDelimieter
                terminalSettings.exitCommands = this.exitCommands
                terminalSettings.initCommands = this.initCommands

                this._connection = new TerminalConnection(this.comPort, terminalSettings)
            }
        }

        this.applyListeners()
    }

    public get isConnected(): boolean {
        return this._isConnected
    }

    public get isEnabled(): boolean {
        return this._isEnabled
    }

    public set isEnabled(isEnabled: boolean) {
        this._isEnabled = isEnabled

        if(this._connection) {
            if(this._isEnabled === false) {
                this._connection.end()  // planning to depricate disconnect
                this._connection.destroy()
            } else {
                if(this.connectionType == 'IS_SOCKET') {
                    const c = this._connection as ISSocket
                    c.host = this.host
                    c.port = this.port
                    c.filter = this.filter

                    c.connect()
                } else if(this.connectionType == 'SERIAL_TNC') {
                    const c = this._connection as TerminalConnection

                    c.open()
                }
            }
        }
    }

    public get connection(): ISSocket | TerminalConnection {
        return this._connection
    }

    public set connection(conn: ISSocket | TerminalConnection) {
        if(this._connection && this._connection !== null && this.connection !== undefined) {
            this._connection.end()
            this._connection.destroy()
        }

        this._connection = conn
        this.applyListeners()
    }

    private applyListeners() : void {
        _.each(this.DISCONNECT_EVENTS, e => {
            this._connection.on(e, () => {
                this._isConnected = false
            })
        })

        _.each(this.CONNECT_EVENTS, e => {
            this._connection.on(e, () => {
                this._isConnected = true
            })
        })
    }
}
