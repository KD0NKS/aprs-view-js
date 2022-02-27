import _ from "lodash"
import EventEmitter from "events"

import { aprsParser } from "js-aprs-fap"

import { StringUtil } from "@/utils"
import { Mapper } from "@/utils/mappers"

import { ConnectionFactory } from "@/factories"

import { AbstractConnection, IConnection } from "@/models/connections"
import { IStationSettings } from "@/models/settings"

export class ConnectionService extends EventEmitter {
    private _connections: AbstractConnection[] = new Array<AbstractConnection>()
    private _connectionFactory: ConnectionFactory
    private _mapper = new Mapper()
    private _parser = new aprsParser()

    public constructor(appId: string) {
        super()

        this._connectionFactory = new ConnectionFactory()
    }

    public addConnection(setting: IConnection) {
        if(setting !== null) {
        /*
            // Create an instance of ISConnection or TNCConnection
            const conn: AbstractConnection = this._connectionFactory.create(setting)
            this._connections.push(conn)

            this.attachListeners(conn)

            Store.dispatch(ActionTypes.ADD_CONNECTION, setting)
            */
        }

    }

    public deleteConnection(id: string): void {
        /*
        const connection = this._connections.find((x) => { return x.id === id })
        const index = this._connections.map(_ => { return _.id }).indexOf(id)

        this._connections.splice(index, 1)
        connection.connection.removeAllListeners()

        Store.dispatch(ActionTypes.DELETE_CONNECTION, id)
        */
    }

    public getConnection(id: string): AbstractConnection {
        return this._connections.find((x) => { return x.id === id })
    }

    public getConnections(): AbstractConnection[] {
        return this._connections
    }

    public updateConnection(viewModel: IConnection): void {
        /*
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
            } catch(error) {
                console.log(error)
            }

            try {
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
        */
    }

    public ChangeEvent(appId: string, stationSettings: IStationSettings): void {

    }

    private attachListeners(conn: AbstractConnection): void {
        /*
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
                        data = data.trim().replace(/^[cmd:]*, '') cmd needs to have a / after the *
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
            */
    }

    private getCallsign(callsign: string, ssid?: string): string {
        let retVal = callsign

        if(!StringUtil.IsNullOrWhiteSpace(ssid)) {
            retVal = `${callsign}-${ssid}`
        }

        return retVal
    }
}
