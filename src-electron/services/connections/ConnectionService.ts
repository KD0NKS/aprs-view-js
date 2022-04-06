import { uid } from 'quasar'
import _ from 'lodash'
import { EventEmitter } from 'events'

import { ISSocket } from 'js-aprs-is'
import { TerminalSocket } from 'js-aprs-tnc'

import { StringUtil } from '../../../src/utils/StringUtil'

import { IConnection } from '../../../src/models/connections/IConnection'
import { IStationSettings } from '../../../src/models/settings/IStationSettings'
import { ConnectionEventTypes } from '../../../src/enums/ConnectionEventTypes'
import { DataEventTypes } from '../../enums/DataEventTypes'
import { aprsParser } from 'js-aprs-fap'

export class ConnectionService extends EventEmitter {
    private _connections: Array<ISSocket | TerminalSocket>
    private _parser = new aprsParser()
    private _callsign = ''
    private _passcode = -1
    private _ssid = null
    private SOCKET_DISCONNECT_EVENTS: string[] = ['destroy', 'end', 'close', 'error', 'timeout']
    private SOCKET_CONNECT_EVENTS: string[] = ['connect', 'ready']

    private readonly appId = 'js-aprs-view 0.0.1'

    public constructor() {
        super()

        this._connections = new Array<ISSocket | TerminalSocket>()
    }

    // NOTE: This expects the front end is always creating an IS Socket.  To change it to any other type, you have to update the connection.
    public addConnection(setting: IConnection): ISSocket { // TODO: || TerminalSOcket
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
                    this.emit(DataEventTypes.PACKET, data)
                }
            })

            if(connection instanceof ISSocket) {
                for(const e of this.SOCKET_DISCONNECT_EVENTS) {
                    connection.on(e, () => {
                        this.emit(ConnectionEventTypes.DISCONNECTED, connection.id)
                    })
                }

                for(const e of this.SOCKET_CONNECT_EVENTS) {
                    connection.on(e, () => {
                        this.emit(ConnectionEventTypes.CONNECTED, connection.id)

                        if(e == 'ready') {
                            (connection as ISSocket).sendLine((connection as ISSocket).userLogin)
                        }
                    })
                }
            }

            connection.on(DataEventTypes.DATA, (data: string) => {
                this.emit(DataEventTypes.DATA, data.toString())
            })

            if(setting.isEnabled === true) {
                (connection as ISSocket).connect()
            }

            return connection
        }

        // TODO: Else throw error

        return null
    }

    public deleteConnection(id: string | number): void {
        const connection = _.find(this._connections, c => { (c as ISSocket).id == id})

        if(connection == null) {
            return
        }

        if(connection instanceof ISSocket) {
            (connection as ISSocket).removeAllListeners();
            (connection as ISSocket).disconnect();
        }
        // TODO: Handle terminal socket listeners

        _.remove(this._connections, { id: (connection as ISSocket).id })

        return
    }

    public updateConnection(setting: IConnection): void {
        let connection = this.findConnection(setting.id)

        if(connection instanceof ISSocket && setting.connectionType == 'IS_SOCKET') {
            connection.filter = setting["filter"]

            if(connection.host != setting["host"] || connection.port != setting["port"]) {
                // Changing the host or port has no effect, tear it down and start over.
                this.deleteConnection(setting.id)
                connection = this.addConnection(setting)
            } else {
                try {
                    connection.sendLine(`# filter ${setting["filter"]}`)
                } catch {
                    console.log('Connection not enabled, nothing to do.')
                }
            }
        } else {
            console.log('Changing Connection Type')
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
            let fullCall = this._callsign

            if(!StringUtil.IsNullOrWhiteSpace(this._ssid)) {
                fullCall = `${this._callsign}-${this._ssid}`
            }

            _.each(this._connections, conn => {
                if(conn instanceof ISSocket) {
                    conn.callsign = fullCall
                    conn.passcode = this._passcode

                    conn.sendLine(conn.userLogin)
                }
                //else if(conn instanceof TerminalSocket) {
                //    // TODO: Need to be able to access and update terminal settings options and resend mycall command
                //    console.log('test')
                //}

                // TODO: Handle non supported connection types
            })
        }
    }

    private findConnection(id: string | number ): ISSocket | TerminalSocket {
        return _.find(this._connections, { id: id })
    }
}
