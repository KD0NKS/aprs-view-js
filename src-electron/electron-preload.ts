/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
import { contextBridge } from 'electron'
import { DataEventTypes } from './enums/DataEventTypes'

import { IConnection } from '../src/models/connections/IConnection'
import { IStationSettings } from '../src/models/settings/IStationSettings'
import { ConnectionService } from './services/connections/ConnectionService'
import { connect } from 'http2'

const connectionService = new ConnectionService()

contextBridge.exposeInMainWorld('connectionService', {
    addConnection: (settings: IConnection) => {
        connectionService.addConnection(settings)
    }
    , setConnectionStatus(connectionId, isEnabled) {
        connectionService.updateConnectionStatus(connectionId, isEnabled)
    }
    , updateConnection: (settings: IConnection) => {
        connectionService.updateConnection(settings)
    }
    , updateConnectionStatus: (id: string, isEnabled: boolean) => {
        connectionService.updateConnectionStatus(id, isEnabled)
    }
    , updateStationSettings: (settings: IStationSettings) => {
        connectionService.updateStationSettings(settings)
    }
    , getDataStream: (fn) => {
        const subscription = (data: string) => fn(data)
        connectionService.on(DataEventTypes.DATA, subscription)

        // Return a function to kill the event listener
        return () => {
            connectionService.removeListener(DataEventTypes.DATA, fn)
        }
    }
    , getPacketStream: (fn) => {
        const subscription = (packet: string) => fn(packet)
        connectionService.on(DataEventTypes.PACKET, subscription)

        // Return a function to kill the event listener
        return () => {
            connectionService.removeListener(DataEventTypes.PACKET, subscription)
        }
    }
})
