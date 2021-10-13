import { ISSocket } from "js-aprs-is"
import { AbstractConnection } from "./AbstractConnection"
import store from "@/store"
import { IConnection } from "./IConnection"

export class ISConnection extends AbstractConnection {
    public host?: string = null
    public port?: number = null
    public filter?: string = null

    constructor(settings?: IConnection) {
        super(settings)

        this._connection = new ISSocket(
            this.host
            , this.port
            , store.state.stationSettings.callsign
            , store.state.stationSettings.passcode
            , this.filter
            , store.state.connectionService.appId
        )
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
