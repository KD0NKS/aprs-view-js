import { AprsPathEnum } from "../../../src-electron/enums";
import { LocationTypes } from '../../enums/LocationTypes'
import { IStationSettings } from '../../models/settings'

export class StationSettings implements IStationSettings {
    callsign: string = 'N0CALL';
    passcode: number = -1;
    ssid: string = '';
    symbol?: string = null;
    symbolOverlay?: string = null;
    aprsPath: AprsPathEnum = AprsPathEnum.WIDE2_2;

    // location settings
    comment?: string = null
    isTransmitPosition: boolean = false
    locationType: string = LocationTypes.NONE
    longitude?: number = null
    latitude?: number = null

    // in minutes
    transmitInterval = 15
}
