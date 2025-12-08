import { IConnection } from "./models/connections/IConnection"
import { IStationSettings } from "./models/settings"

export interface IConnectionService {
        addConnection: (settings: IConnection) => Promise<void>
        , deleteConnection: (connectionId: string | number) => Promise<void>
        , getConnectionStatus: (connectionId: string | number) => Promise<boolean>
        , setConnectionStatus: (connectionId, isEnabled) => Promise<void>
        , sendPacket: (packet: string) => Promise<void>
        , updateConnection: (settings: IConnection) => Promise<void>
        , updateConnectionStatus: (id: string, isEnabled: boolean) => Promise<void>
        , updateStationSettings: (settings: IStationSettings) => Promise<void>
        , getComPorts: () => Promise<string[]>
        , getConnectionStatusStream: (fn) => Promise<() => void>
        , getDataStream: (fn) => Promise<() => void>
        , getPacketStream: (fn) => Promise<() => void>
}

declare global {
    interface Window {
        connectionService: IConnectionService
    }
}
