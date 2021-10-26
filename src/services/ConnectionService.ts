import _ from 'lodash'
import ActionTypes from '@/ActionTypes'
import { Mapper } from '@/utils/mappers'
import { aprsParser } from 'js-aprs-fap'
import { DataEventTypes } from '@/enums/DataEventTypes'
import { EventEmitter } from 'events'
import { ISSocket } from 'js-aprs-is'
import { TerminalSocket } from 'js-aprs-tnc'
import { StringUtil } from '@/utils';
import { ConnectionFactory } from './ConnectionFactory'
import { IConnection, AbstractConnection, TNCConnection, ConnectionViewModel, ISConnection } from '@/models'
import Store from '@/store'
import GetterTypes from "@/GetterTypes"

/**
 * TODO: Refactor to decouple this from Vue/Vuex
 */
export class ConnectionService extends EventEmitter { //implements IObserver {
    private _connections: AbstractConnection[] = new Array<AbstractConnection>()
    private _connectionFactory: ConnectionFactory
    private _mapper = new Mapper()
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

            this.attachListeners(conn)

            Store.dispatch(ActionTypes.ADD_CONNECTION, setting)
        }
    }

    public deleteConnection(id: string): void {
        const connection = this._connections.find((x) => { return x.id === id })
        const index = this._connections.map(_ => { return _.id }).indexOf(id)

        this._connections.splice(index, 1)
        connection.connection.removeAllListeners()

        Store.dispatch(ActionTypes.DELETE_CONNECTION, id)
    }

    public getConnection(id: string): AbstractConnection {
        return this._connections.find((x) => { return x.id === id })
    }

    public getConnections(): AbstractConnection[] {
        return this._connections
    }

    public updateConnection(viewModel: ConnectionViewModel): void {
        const connection = this.getConnection(viewModel.id)

        // TODO: Is this the appropriate place to handle connection type switching?  I doubt it!
        if(connection.connectionType == viewModel.connectionType) {
            if(viewModel.connectionType == "IS_SOCKET") {
                this._mapper.CopyInto<ConnectionViewModel, ISConnection>(viewModel, (connection as ISConnection))     // TODO: MAPPER IS NOT WORKING
            } else if(viewModel.connectionType == "SERIAL_TNC") {
                this._mapper.CopyInto<ConnectionViewModel, TNCConnection>(viewModel, (connection as TNCConnection))   // TODO: MAPPER IS NOT WORKING
            }

            Store.dispatch(ActionTypes.SAVE_CONNECTION, viewModel) // TODO: map to view model
        } else {
            try {
                connection.isEnabled = false
                connection.connection.removeAllListeners()

                const newConnection = this._connectionFactory.create(viewModel)
                newConnection.id = viewModel.id
                newConnection.name = viewModel.name
                newConnection.connectionType = viewModel.connectionType

                this.attachListeners(newConnection)

                const idx = _.findIndex(this._connections, { id: connection.id })
                this._connections.splice(idx, 1, newConnection)

                Store.dispatch(ActionTypes.SAVE_CONNECTION, viewModel) // TODO: map to view model
            } catch(error) {
                console.log(error)
                // better error handling
            }
        }

        return
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

    private attachListeners(conn: AbstractConnection): void {
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

    private getCallsign(callsign: string, ssid?: string): string {
        let retVal = callsign

        if(StringUtil.IsNullOrWhiteSpace(ssid)) {
            retVal = `${callsign}-${ssid}`
        }

        return retVal
    }
}
