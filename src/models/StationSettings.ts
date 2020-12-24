import APRSSymbol from "./APRSSymbol"

export class StationSettings {
    public callsign: string = "N0CALL"
    public passcode: number = -1
    public ssid: string = ''
    public symbol?: APRSSymbol = null
    public symbolOverlay?: string = ''
}