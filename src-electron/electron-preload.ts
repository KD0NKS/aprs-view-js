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
import { IConnection } from '../src/models/connections/IConnection'
import { IStationSettings } from '../src/models/settings/IStationSettings'
import { ConnectionService } from './services/connections/ConnectionService'

const connectionService = new ConnectionService()

contextBridge.exposeInMainWorld('connectionService', {
    addConnection: (settings: IConnection) => {
        connectionService.addConnection(settings)
    }
    , updateConnection: (settings: IConnection) => {
        connectionService.updateConnection(settings)
    }
    , updateStationSettings: (settings: IStationSettings) => {
        connectionService.updateStationSettings(settings)
    }
})
