import { aprsParser } from 'js-aprs-fap';
import { Connection } from '@/models/Connection';
import DataEventTypes from '@/enums/DataEventTypes';
import { EventEmitter } from 'events';
import { IConnection } from '@/models/IConnection';
import { ISSocket } from 'js-aprs-is';
import store from '@/store'
//import { IObserver } from '../observable/IObserver';
//import { StationSettings } from '@/settings/StationSettings';

/**
 * Singleton
 * Listens to StationSettings
 * TODO: Refactor to decouple this from Vue/Vuex
 */
export class ConnectionService extends EventEmitter { //implements IObserver {
    private _appId = 'js-aprs-view 1.0.0';  // TODO: Read this from the config
    private _connections: Connection[] = new Array<Connection>()
    //private _settings = StationSettings;
    private _parser = new aprsParser()

    // TODO: Need an app version here too
    public constructor(connections?: Array<IConnection>) {
        super()

        if(connections) {
            connections.forEach(x => this.addConnection(x))
        }

        //this._settings.RegisterObserver(this);
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
                            const msg = this._parser.parseaprs(data)
                            this.emit(DataEventTypes.PACKET, msg)
                        } catch (err) {
                            this.emit(DataEventTypes.ERROR, err)
                        }
                    }
                })

                conn.connection.on(DataEventTypes.DATA, (data: string) => {
                    this.emit(DataEventTypes.DATA, data)
                })

                conn.connection.on('error', (err: Error) => {
                    this.emit(DataEventTypes.ERROR, err)
                })

                if(conn.isEnabled === true) {
                    (conn.connection as ISSocket).connect()
                }
            }

            this._connections.push(conn)
        }
    }

    public getConnection(id: string): Connection {
        return this._connections.find((x) => { return x.id === id })
    }

    public getConnections(): Connection[] {
        return this._connections
    }

    public ChangeEvent(): void {
        this._connections
            .filter((x) => { return x.connection.constructor.name == 'ISSocket' })
            .map(conn => {
                const c = conn.connection as ISSocket

                c.callsign = this.getCallsign
                c.passcode = store.state.stationSettings.passcode
                c.appId = this.appId

                c.sendLine(c.userLogin)
            });
    }

    private get getCallsign(): string {
        let callsign = store.state.stationSettings.callsign

        if(store.state.stationSettings.ssid !== null && store.state.stationSettings.ssid !== undefined) {
            callsign = `${callsign}-${store.state.stationSettings.ssid}`
        }

        return callsign
    }
}