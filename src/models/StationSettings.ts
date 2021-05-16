import { IStationSettings } from "./IStationSettings"

export class StationSettings implements IStationSettings {
    public callsign: string = "N0CALL"
    public passcode: number = -1
    public latitude?: number = null
    public longitude?: number = null
    public ssid?: string = null
    public symbol?: string = null
    public symbolOverlay?: string = null
}
