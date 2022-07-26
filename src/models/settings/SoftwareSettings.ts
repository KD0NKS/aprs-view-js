import { DistanceUnitTypes, TemperatureUnitTypes } from "@/enums"
import { ISoftwareSettings } from "@/models/settings"

export class SoftwareSettings implements ISoftwareSettings {
    public distanceUnitType: string = DistanceUnitTypes.IMPERIAL
    public isDarkMode: boolean = false        // true, false, or auto
    public temperatureUnitType: string = TemperatureUnitTypes.FARENHEIGHT
}
