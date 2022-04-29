import { DistanceUnitTypes, TemperatureUnitTypes } from "@/enums"
import { ISoftwareSettings } from "@/models/settings"

export class SoftwareSettings implements ISoftwareSettings {
    public distanceUnitType: string = TemperatureUnitTypes.FARENHEIGHT
    public isDarkMode: boolean = false        // true, false, or auto
    public temperatureUnitType: string = DistanceUnitTypes.IMPERIAL
}
