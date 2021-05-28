export interface IStationSettings {
    beaconInterval: number
    callsign: string
    passcode: number
    isBeaconEnabled?: boolean
    latitude?: number
    longitude?: number
    ssid?: string
    symbol?: string
    symbolOverlay?: string
}
