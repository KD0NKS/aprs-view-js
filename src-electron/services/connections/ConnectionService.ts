import { uid } from 'quasar'
import _ from 'lodash'
import { EventEmitter } from 'events'

import { ISSocket } from 'js-aprs-is'
import { TerminalSocket } from 'js-aprs-tnc'

import { StringUtil } from '../../../src/utils/StringUtil'

import { IConnection } from '../../../src/models/connections/IConnection'
import { IStationSettings } from '../../../src/models/settings/IStationSettings'
import { DataEventTypes } from '../../enums/DataEventTypes'
import { aprsParser } from 'js-aprs-fap'

export class ConnectionService extends EventEmitter {
    private _connections: Array<ISSocket | TerminalSocket>
    private _parser = new aprsParser()
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
            const connection = new ISSocket(setting["host"], setting["port"], this._callsign, this._passcode, setting["filter"], this.appId, setting["id"] ?? uid())
            this._connections.push(connection)

            connection.on(DataEventTypes.PACKET, (data: string) => {
                if(data.charAt(0) != '#') {
                    try {
                        const msg = this._parser.parseaprs(data.trim(), { accept_broken_mice: true })
                        msg.id = uid()
                        this.emit(DataEventTypes.PACKET, msg)
                    } catch (err) {
                        this.emit(DataEventTypes.ERROR, err)
                    }
                } else {
                    if(data.startsWith('#')) {
                        (connection as ISSocket).sendLine((connection as ISSocket).userLogin)
                        this.emit(DataEventTypes.PACKET, data)
                    }
                }
            })

            connection?.on(DataEventTypes.DATA, (data: string) => {
                this.emit(DataEventTypes.DATA, data)
            })

            if(setting.isEnabled === true) {
                (connection as ISSocket).connect()
            }
        } else if(setting.connectionType == 'TERMINAL_SOCKET') {
            //this._connections.push(new TerminalSocket())
        }

        // TODO: Else throw error
    }

    public updateConnection(setting: IConnection): void {
        const connection = this.findConnection(setting.id)

        if(setting.connectionType == 'IS_SOCKET') {
            // TODO: implement this
        }
    }

    public updateConnectionStatus(id: string, isEnabled: boolean): void {
        const connection = this.findConnection(id)

        if(connection) {
            if(connection instanceof ISSocket) {
                if(isEnabled) {
                    connection.connect()
                } else {
                    connection.disconnect()
                }
            }

            // TODO: Handle TNC
            // TODO: Handle non supported connection types
        }
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
                if(conn instanceof ISSocket) {
                    conn.callsign = this._callsign

                    if(!StringUtil.IsNullOrWhiteSpace(this._ssid)) {
                        conn.callsign = `${this._callsign}-${this._ssid}`
                    }

                    conn.passcode = this._passcode
                }

                // TODO: Handle non supported connection types
            })
        }
    }

    private findConnection(id: string | number ): ISSocket | TerminalSocket {
        return _.find(this._connections, { id })
    }
}
