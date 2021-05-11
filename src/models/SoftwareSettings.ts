import { DistanceUnitTypes, TemperatureUnitTypes } from "@/enums"
import { ISoftwareSettings } from "@/models/ISoftwareSettings"

export class SoftwareSettings implements ISoftwareSettings {
    // TODO: Try to use enum key here
    public distanceUnitType: string = 'IMPERIAL'
    public temperatureUnitType: string = 'FARENHEIGHT'
}
