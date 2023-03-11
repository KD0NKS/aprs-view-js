import { LocationTypes } from '@/enums/LocationTypes'
import { IStationSettings } from '@/models/settings'

export class StationSettings implements IStationSettings {
    callsign: string = 'N0CALL'
    passcode: number = -1
    ssid: string = ''
    symbol?: string = null
    symbolOverlay?: string = null

    // location settings
    comment?: string = null
    isTransmitPosition: boolean = false
    locationType: string = LocationTypes.NONE
    longitude?: number = null
    latitude?: number = null

    // in minutes
    transmitInterval = 15
}
