import { DistanceUnitTypes, TemperatureUnitTypes } from "@/enums";
import { ISoftwareSettings } from "@/models/ISoftwareSettings";

export class SoftwareSettings implements ISoftwareSettings {
    public distanceUnitType: string = DistanceUnitTypes.IMPERIAL
    public temperatureUnitType: string = TemperatureUnitTypes.FARENHEIGHT
}
