import * as crypto from "crypto";
import { IConnection } from "./IConnection";
import { ISSocket } from "js-aprs-is";
import { Socket } from "net";
import store from "@/store";

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

    private _connection: Socket
    private _isConnected = false
    private _isEnabled = false
    private DISCONNECT_EVENTS: string[] = ['destroy', 'end', 'close', 'error', 'timeout']
    private CONNECT_EVENTS: string[] = ['connect']

    constructor(connection?: Partial<Connection>) {
        this.id = crypto.randomBytes(16).toString('hex')

        Object.assign(this, connection)

        if(!connection.connection && connection.connectionType == 'IS_SOCKET') {
            this.connection = new ISSocket(
                this.host
                , this.port
                , store.state.stationSettings.callsign
                , store.state.stationSettings.passcode
                , this.filter
                , store.state.connectionService.appId)
        }
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
            if(this.connectionType == 'IS_SOCKET') {
                if(this._isEnabled === false) {
                    this._connection.end()  // planning to depricate disconnect
                } else {
                    const c = this._connection as ISSocket
                    c.host = this.host
                    c.port = this.port
                    c.filter = this.filter

                    c.connect()
                }
            }
        }
    }

    public get connection(): Socket {
        return this._connection
    }

    public set connection(conn: Socket) {
        if(this._connection && this._connection !== null && this.connection !== undefined) {
            this._connection.end()
            this._connection.destroy()
        }

        this._connection = conn

        // This won't work since connection is null
        for(const e in this.DISCONNECT_EVENTS) {
            this._connection.on(e, () => {
                this._isConnected = false
            })
        }

        for(const e in this.CONNECT_EVENTS) {
            this._connection.on(e, () => {
                this._isConnected = true
            })
        }
    }
}