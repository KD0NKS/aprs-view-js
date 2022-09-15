export interface IStationSettings {
    callsign: string
    passcode: number
    ssid: string
    symbol?: string
    symbolOverlay?: string
    isTransmitPosition: boolean
    latitude: number
    locationType: string
    longitude: number
}
