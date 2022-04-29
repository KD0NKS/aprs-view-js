import { IStationSettings } from '@/models/settings'

export class StationSettings implements IStationSettings {
    callsign: string = 'N0CALL'
    passcode: number = -1
    ssid: string = ''
    symbol?: string = null
    symbolOverlay?: string = null
}
