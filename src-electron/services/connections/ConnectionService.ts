import { EventEmitter } from 'events'
import _ from 'lodash'

import { ISSocket } from 'js-aprs-is'
import { TerminalSocket } from 'js-aprs-tnc'

import { StringUtil } from '../../../src/utils/StringUtil'

import { IConnection } from '../../../src/models/connections/IConnection'
import { IStationSettings } from '../../../src/models/settings/IStationSettings'

export class ConnectionService extends EventEmitter {
    private _connections: Array<ISSocket | TerminalSocket>
    private _callsign = ''
    private _passcode = -1
    private _ssid = null

    private readonly appId = 'js-aprs-view 0.0.1'

    public constructor() {
        super()

        this._connections = new Array<ISSocket | TerminalSocket>()
    }

    public addConnection(setting: IConnection): void {
        if(setting.connectionType == 'IS_SOCKET') {
            this._connections.push(new ISSocket(setting["host"], setting["port"], this._callsign, this._passcode, setting["filter"], this.appId))
        } else if(setting.connectionType == 'TERMINAL_SOCKET') {
            //this._connections.push(new TerminalSocket())
            console.log('added terminal socket: ' + setting.name)
        }
        // TODO: Else throw error
    }

    public updateConnection(setting: IConnection): void {
        const connection = _.find(this._connections, { id: setting.id })
    }

    public updateStationSettings(settings: IStationSettings): void {
        let isUpdated = false

        if(this._callsign != settings.callsign) {
            this._callsign = settings.callsign.trim()

            isUpdated = true
        }

        if(this._ssid != settings.ssid) {
            this._ssid = settings.ssid

            isUpdated = true
        }

        if(this._passcode != settings.passcode) {
            this._passcode = settings.passcode ?? -1

            isUpdated = true
        }

        if(isUpdated == true) {
            _.each(this._connections, conn => {
                console.log(typeof(conn))

                if(conn instanceof ISSocket) {
                    conn.callsign = this._callsign

                    if(!StringUtil.IsNullOrWhiteSpace(this._ssid)) {
                        conn.callsign = `${this._callsign}-${this._ssid}`
                    }

                    conn.passcode = this._passcode
                }
            })
        }
    }
}
