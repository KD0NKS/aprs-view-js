import _ from 'lodash'
import { Connection } from '@/models/connections/Connection';
import { aprsParser } from 'js-aprs-fap'
import { DataEventTypes } from '@/enums/DataEventTypes'
import { EventEmitter } from 'events'
import { IConnection } from '@/models/connections/IConnection'
import { ISSocket } from 'js-aprs-is'
import { TerminalSocket } from 'js-aprs-tnc'
import store from '@/store'
import { StringUtil } from '@/utils';
//import { IObserver } from '../observable/IObserver';
//import { StationSettings } from '@/settings/StationSettings';

/**
 * TODO: Refactor to decouple this from Vue/Vuex
 */
export class ConnectionService extends EventEmitter { //implements IObserver {
    private _appId = 'js-aprs-view 1.0.0';  // TODO: Read this from the config
    private _connections: Connection[] = new Array<Connection>()
    //private _settings = StationSettings;
    private _parser = new aprsParser()

    // TODO: Need to get an app version here too
    public constructor() {
        super()
    }

    public set appId(value: string) {
        this._appId = value
        this.ChangeEvent()
    }

    public get appId(): string {
        return this._appId
    }

    public addConnection(setting: IConnection) {
        if(setting !== null) {
            const conn: Connection = setting as Connection

            this._connections.push(conn)

            // TODO: Refactor this to get an instance of either ISSocket or TNCConnection
            if(conn.connectionType == 'IS_SOCKET') {
                // todo validation before creation
                //const connection = new ISSocket(conn.host, conn.port, this.getCallsign, store.state.stationSettings.passcode, conn.filter, this._appId)
                //conn.connection = connection

                conn.connection.on('connect', () => {
                    (conn.connection as ISSocket).sendLine((conn.connection as ISSocket).userLogin)
                });

                conn.connection.on(DataEventTypes.PACKET, (data: string) => {
                    if(data.charAt(0) != '#') {
                        try {
                            const msg = this._parser.parseaprs(data.trim())
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
                        // TODO: The command should be a parameter set by the user to strip off the beginning of the packet
                        data = data.trim().replace(/^[cmd:]*/, '')
                        const msg = this._parser.parseaprs(data)
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

    public getConnection(id: string): Connection {
        return this._connections.find((x) => { return x.id === id })
    }

    public getConnections(): Connection[] {
        return this._connections
    }

    // TODO: Should this be a listener.  Making this listen to station settings creates a loop dependency,
    // which begs the question, should they all be part of the same class?  Currently there is no station settings service.
    // Currently vuex only supports subscribing to all actions with an if statement inside for filtering.
    // Method is currently used by store to push change events.
    public ChangeEvent(): void {
        _.forEach(this._connections, (conn: Connection) => {
            if(conn.connectionType == 'IS_SOCKET') {
                const c = conn.connection as ISSocket

                c.callsign = store.state.stationSettings.callsign
                c.passcode = store.state.stationSettings.passcode
                c.appId = this.appId

                if(conn.isEnabled == true)
                    c.sendLine(c.userLogin)
            } else if(conn.connectionType == 'SERIAL_TNC') {
                // TODO: send callsign command
                const c = conn.connection as TerminalSocket

                if(!StringUtil.IsNullOrWhiteSpace(store.state.stationSettings.callsign)) {
                    let callsign = store.state.stationSettings.callsign

                    if(!StringUtil.IsNullOrWhiteSpace(store.state.stationSettings.ssid))
                        callsign = `${callsign}-${store.state.stationSettings.ssid}`

                    if(conn.isEnabled == true && !StringUtil.IsNullOrWhiteSpace(conn.myCallCommand)) {
                        c.sendCommand(`${conn.myCallCommand} ${callsign}`)
                    }
                }
            }
        })
    }

    private get getCallsign(): string {
        let callsign = store.state.stationSettings.callsign

        if(store.state.stationSettings.ssid !== null && store.state.stationSettings.ssid !== undefined) {
            callsign = `${callsign}-${store.state.stationSettings.ssid}`
        }

        return callsign
    }
}
