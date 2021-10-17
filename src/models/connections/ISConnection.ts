import { IConnection } from "./IConnection"
import { ISSocket } from "js-aprs-is"
import { AbstractConnection } from "./AbstractConnection"
import Store from '@/store'
import GetterTypes from "@/GetterTypes"

export class ISConnection extends AbstractConnection {
    public host?: string = null
    public port?: number = null
    public filter?: string = null

    constructor(connectionSettings?: IConnection) {
        super(connectionSettings)

        // TODO: callsign, passcode, app id need to be passed in
        if(connectionSettings) {
            this.host = connectionSettings["host"] ?? null
            this.port = connectionSettings["port"] ?? null
            this.filter = connectionSettings["filter"] ?? null
        }

        this._connection = new ISSocket(
            this.host
            , this.port
            , Store.state.stationSettings.callsign
            , Store.state.stationSettings.passcode
            , this.filter
            , Store.getters[GetterTypes.APP_ID]
        )

        this.applyListeners()
    }

    public set isEnabled(isEnabled: boolean) {
        this._isEnabled = isEnabled

        if(this._connection) {
            if (this._isEnabled === false) {
                this._connection.end()  // TODO: planning to depricate disconnect
            } else {
                const c = this._connection as ISSocket
                c.host = this.host
                c.port = this.port
                c.filter = this.filter

                c.connect()
            }
        }
    }

    public get isEnabled(): boolean {
        return this._isEnabled
    }
}
