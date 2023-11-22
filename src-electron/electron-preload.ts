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
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge, ipcMain, ipcRenderer } from 'electron'
import { ConnectionEventTypes } from '../src/enums/ConnectionEventTypes'

import { IConnection } from '../src/models/connections/IConnection'
import { IStationSettings } from '../src/models/settings/IStationSettings'
import { DataEventTypes } from './enums/DataEventTypes'
import { IpcEventTypes } from './enums/IpcEventTypes'

//const connectionService = new ConnectionService()

// TODO/NOTE: connection service may need to be in main
contextBridge.exposeInMainWorld('connectionService', {
    addConnection: (settings: IConnection) => {
        ipcRenderer.invoke(IpcEventTypes.CONNECTION_SERVICE_ADD_CONNECTION, settings)
    }
    , deleteConnection: (connectionId: string | number) => {
        ipcRenderer.invoke(IpcEventTypes.CONNECTION_SERVICE_DELETE_CONNECTION, connectionId)
    }
    , getConnectionStatus: async (connectionId: string | number) => {
        return await ipcRenderer.invoke(IpcEventTypes.CONNECTION_SERVICE_GET_CONNECTION_STATUS, connectionId)
    }
    , setConnectionStatus(connectionId, isEnabled) {
        ipcRenderer.invoke(IpcEventTypes.CONNECTION_SERVICE_SET_CONNECTION_STATUS, connectionId, isEnabled)
    }
    , updateConnection: (settings: IConnection) => {
        ipcRenderer.invoke(IpcEventTypes.CONNECTION_SERVICE_UPDATE_CONNECTION, settings)
    }
    , updateConnectionStatus: (id: string, isEnabled: boolean) => {
        ipcRenderer.invoke(IpcEventTypes.CONNECTION_SERVICE_UPDATE_CONNECTION_STATUS, id, isEnabled)
    }
    , updateStationSettings: (settings: IStationSettings) => {
        ipcRenderer.invoke(IpcEventTypes.CONNECTION_SERVICE_UPDATE_STATION_SETTINGS, settings)
    }
    , getComPorts: async () => {   // TODO: Make a system api
        return await ipcRenderer.invoke(IpcEventTypes.GET_COM_PORTS)
    }
    , getConnectionStatusStream: (fn) => {
        const subscription = (evt: string, id: string | number) => fn(evt, id)

        ipcRenderer.on(ConnectionEventTypes.CONNECTED, (event, arg) => subscription(ConnectionEventTypes.CONNECTED, arg))
        ipcRenderer.on(ConnectionEventTypes.DISCONNECTED, (event, arg) => subscription(ConnectionEventTypes.DISCONNECTED, arg))

        return () => {
            ipcRenderer.removeListener(ConnectionEventTypes.CONNECTED, subscription)
            ipcRenderer.removeListener(ConnectionEventTypes.DISCONNECTED, subscription)
        }
    }
    , getDataStream: (fn) => {
        const subscription = (evt, data: string) => fn(data)
        ipcRenderer.on(DataEventTypes.DATA, subscription)

        // Return a function to kill the event listener
        return () => {
            ipcRenderer.removeListener(DataEventTypes.DATA, fn)
        }
    }
    , getPacketStream: (fn) => {
        const subscription = (evt, packet: string) => fn(packet)
        ipcRenderer.on(DataEventTypes.PACKET, subscription)

        // Return a function to kill the event listener
        return () => {
            ipcRenderer.removeListener(DataEventTypes.PACKET, subscription)
        }
    }
})
