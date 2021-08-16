import { DistanceUnitTypes, TemperatureUnitTypes } from "@/enums"
import { ISoftwareSettings } from "@/models/ISoftwareSettings"

export class SoftwareSettings implements ISoftwareSettings {
    // TODO: Try to use enum key here
    public distanceUnitType: string = DistanceUnitTypes.IMPERIAL
    public isDarkTheme: boolean = false     // TODO: This should probably be themeName and store a string
    public temperatureUnitType: string = TemperatureUnitTypes.FARENHEIGHT
}
