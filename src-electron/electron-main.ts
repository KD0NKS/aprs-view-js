import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import path from 'path'
import os from 'os'

import { IpcEventTypes } from './enums/IpcEventTypes'
import { ConnectionService } from './services/connections/ConnectionService'
import { ConnectionEventTypes } from '../src/enums/ConnectionEventTypes'
import { DataEventTypes } from './enums/DataEventTypes'
import { SerialPortUtil } from './tnc/utils/SerialPortUtil'
import _ from 'lodash'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()
const connectionService = new ConnectionService()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
}
catch (_) { }

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      sandbox: false,
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  }
  else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// addConnection
ipcMain.handle(IpcEventTypes.CONNECTION_SERVICE_ADD_CONNECTION, async (event, settings) => {
    connectionService.addConnection(settings)
})

// deleteConnection
ipcMain.handle(IpcEventTypes.CONNECTION_SERVICE_DELETE_CONNECTION, async (event, connectionId) => {
    connectionService.deleteConnection(connectionId)
})

// sendPacket
ipcMain.handle(IpcEventTypes.CONNECTION_SERVICE_SEND_PACKET, async (event, packet) => {
    connectionService.sendPacket(packet)
})

// setConnectionStatus
ipcMain.handle(IpcEventTypes.CONNECTION_SERVICE_SET_CONNECTION_STATUS, async (event, connectionId, isEnabled) => {
    connectionService.updateConnectionStatus(connectionId, isEnabled)
})

// updateConnection
ipcMain.handle(IpcEventTypes.CONNECTION_SERVICE_UPDATE_CONNECTION, async (event, settings) => {
    connectionService.updateConnection(settings)
})

// updateConnectionStatus
ipcMain.handle(IpcEventTypes.CONNECTION_SERVICE_UPDATE_CONNECTION_STATUS, async (event, connectionId, isEnabled) => {
    connectionService.updateConnectionStatus(connectionId, isEnabled)
})

// updateStationSettings
ipcMain.handle(IpcEventTypes.CONNECTION_SERVICE_UPDATE_STATION_SETTINGS, async (event, settings) => {
    connectionService.updateStationSettings(settings)
})

ipcMain.handle(IpcEventTypes.GET_COM_PORTS, async () => {
    const ports = await SerialPortUtil.getAvailableSerialPorts()

    // TODO: Path + friendly name objects
    return _.reduce(
        ports
        , (result, value) => {
            result.push(value.path)
            return result
        }
        , []
    )
})

ipcMain.handle(IpcEventTypes.CONNECTION_SERVICE_GET_CONNECTION_STATUS, async(event, connectionId) => {
    return connectionService.getConnectionStatus(connectionId)
})

// Connection Events
connectionService.on(ConnectionEventTypes.CONNECTED, id => {
    mainWindow.webContents.send(ConnectionEventTypes.CONNECTED, id)
})

connectionService.on(ConnectionEventTypes.DISCONNECTED, id => {
    mainWindow.webContents.send(ConnectionEventTypes.DISCONNECTED, id)
})

connectionService.on(DataEventTypes.DATA, data => {
    mainWindow.webContents.send(DataEventTypes.DATA, data)
})

connectionService.on(DataEventTypes.PACKET, packet => {
    mainWindow.webContents.send(DataEventTypes.PACKET, packet)
})
