import _ from "lodash"
import * as crypto from "crypto"
import { ISSocket } from "js-aprs-is"
import { TerminalSocket } from "js-aprs-tnc"
import { IConnection } from "./IConnection"

export abstract class AbstractConnection {
    public id: string
    public name: string
    public connectionType: string

    protected _connection: ISSocket | TerminalSocket
    protected _isConnected = false
    protected _isEnabled = false

    protected DISCONNECT_EVENTS: string[] = ['destroy', 'end', 'close', 'error', 'timeout']
    protected CONNECT_EVENTS: string[] = ['connect']

    constructor(settings?: IConnection) {
        this.id = settings["name"] ?? crypto.randomBytes(16).toString('hex')
        this.name = settings["name"] ?? "Default"
        this.connectionType = settings["connectionType"] ?? "IS_SOCKET"

        //if(settings)
        //    Object.assign(this, settings)
    }

    public get connection(): ISSocket | TerminalSocket {
        return this._connection
    }

    public set connection(conn: ISSocket | TerminalSocket) {
        if (this._connection && this._connection !== null && this.connection !== undefined) {
            this._connection.end()
            this._connection.destroy()
        }

        this._connection = conn

        // TODO: This won't work since connection is null
        for (const e in this.DISCONNECT_EVENTS) {
            this._connection.on(e, () => {
                this._isConnected = false
            })
        }

        for (const e in this.CONNECT_EVENTS) {
            this._connection.on(e, () => {
                this._isConnected = true
            })
        }
    }

    public abstract set isEnabled(isEnabled: boolean)
    public abstract get isEnabled(): boolean

    public get isConnected(): boolean {
        return this._isConnected
    }

    protected applyListeners(): void {
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
