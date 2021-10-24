import _ from 'lodash'
import { aprsParser } from 'js-aprs-fap'
import { DataEventTypes } from '@/enums/DataEventTypes'
import { EventEmitter } from 'events'
import { ISSocket } from 'js-aprs-is'
import { TerminalSocket } from 'js-aprs-tnc'
import { StringUtil } from '@/utils';
import { ConnectionFactory } from './ConnectionFactory'
import { IConnection, AbstractConnection, TNCConnection } from '@/models'
import Store from '@/store'
import GetterTypes from "@/GetterTypes"

/**
 * TODO: Refactor to decouple this from Vue/Vuex
 */
export class ConnectionService extends EventEmitter { //implements IObserver {
    private _connections: AbstractConnection[] = new Array<AbstractConnection>()
    private _connectionFactory: ConnectionFactory
    private _parser = new aprsParser()

    // TODO: Need to get an app version here too
    public constructor() {
        super()

        this._connectionFactory = new ConnectionFactory()
    }

    public addConnection(setting: IConnection) {
        if(setting !== null) {
            // Create an instance of ISConnection or TNCConnection
            const conn: AbstractConnection = this._connectionFactory.create(setting)
            this._connections.push(conn)

            // Build the physical connection wrapped by an abstract connection
            if(conn.connectionType == 'IS_SOCKET') {
                // todo validation before creation
                conn.connection.on('connect', () => {
                    (conn.connection as ISSocket).sendLine((conn.connection as ISSocket).userLogin)
                });

                conn.connection.on(DataEventTypes.PACKET, (data: string) => {
                    if(data.charAt(0) != '#') {
                        try {
                            const msg = this._parser.parseaprs(data.trim(), { accept_broken_mice: true })
                            this.emit(DataEventTypes.PACKET, msg)
                        } catch (err) {
                            this.emit(DataEventTypes.ERROR, err)
                        }
                    }
                })

                conn.connection?.on(DataEventTypes.DATA, (data: string) => {
                    this.emit(DataEventTypes.DATA, data)
                })

                if(conn.isEnabled === true) {
                    (conn.connection as ISSocket).connect()
                }
            } else if(conn.connectionType == 'SERIAL_TNC') {
                conn.connection.on(DataEventTypes.PACKET, (data: string) => {
                    try {
                        const receivedTime = Date.now()

                        // TODO: The command should be a parameter set by the user to strip off the beginning of the packet
                        data = data.trim().replace(/^[cmd:]*/, '')
                        const msg = this._parser.parseaprs(data)
                        msg.receivedTime = receivedTime
                        this.emit(DataEventTypes.PACKET, msg)

                        // Serial port on data event will emit character at a time.
                        this.emit(DataEventTypes.DATA, data)
                    } catch (err) {
                        this.emit(DataEventTypes.ERROR, err)
                    }
                })
            }

            conn.connection?.on('error', (err: Error) => {
                this.emit(DataEventTypes.ERROR, err)
                conn.connection.end()
            })
        }
    }

    public deleteConnection(id: string): void {
        const index = this._connections.map(_ => { return _.id }).indexOf(id)
        this._connections.splice(index, 1)
    }

    public getConnection(id: string): AbstractConnection {
        return this._connections.find((x) => { return x.id === id })
    }

    public getConnections(): AbstractConnection[] {
        return this._connections
    }

    // TODO: Should this be a listener.  Making this listen to station settings creates a loop dependency,
    // which begs the question, should they all be part of the same class?  Currently there is no station settings service.
    // Currently vuex only supports subscribing to all actions with an if statement inside for filtering.
    // Method is currently used by store to push change events.
    public ChangeEvent(): void {
        const callsign: string = Store.state.stationSettings.callsign
        const ssid = Store.state.stationSettings.ssid
        const passcode = Store.state.stationSettings.passcode
        const appId = Store.getters[GetterTypes.APP_ID]

        _.forEach(this._connections, (conn: AbstractConnection) => {
            if(conn.connectionType == 'IS_SOCKET') {
                const c = conn.connection as ISSocket
                c.callsign = this.getCallsign(callsign, ssid)
                c.passcode = passcode
                c.appId = appId

                if(conn.isEnabled == true)
                    c.sendLine(c.userLogin)
            } else if(conn.connectionType == 'SERIAL_TNC') {
                // TODO: send callsign command
                const c = conn.connection as TerminalSocket

                if(!StringUtil.IsNullOrWhiteSpace(callsign)) {
                    const cs = this.getCallsign(callsign, ssid)

                    if(conn.isEnabled == true && !StringUtil.IsNullOrWhiteSpace((conn as TNCConnection).myCallCommand)) {
                        c.sendCommand(`${(conn as TNCConnection).myCallCommand} ${cs}`)
                    }
                }
            }
        })
    }

    private getCallsign(callsign: string, ssid?: string): string {
        let retVal = callsign

        if(StringUtil.IsNullOrWhiteSpace(ssid)) {
            retVal = `${callsign}-${ssid}`
        }

        return retVal
    }
}
