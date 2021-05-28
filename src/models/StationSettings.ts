import { IStationSettings } from "./IStationSettings"

export class StationSettings implements IStationSettings {
    public beaconInterval: number = 15
    public callsign: string = "N0CALL"
    public passcode: number = -1
    public isBeaconEnabled: boolean = false
    public latitude?: number = null
    public longitude?: number = null
    public ssid?: string = null
    public symbol?: string = null
    public symbolOverlay?: string = null
}
