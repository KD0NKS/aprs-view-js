import IStationSettings from "./IStationSettings"

export class StationSettings implements IStationSettings {
    public callsign: string = "N0CALL"
    public passcode: number = -1
    public ssid: string = ''
    public symbol?: string = null
    public symbolOverlay?: string = ''
}