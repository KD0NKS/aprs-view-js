export interface IStationSettings {
    callsign: string
    passcode: number
    ssid: string
    symbol?: string
    symbolOverlay?: string

    // location
    comment?: string
    isTransmitPosition: boolean
    latitude?: number
    locationType: string
    longitude?: number
    transmitInterval: number
}
