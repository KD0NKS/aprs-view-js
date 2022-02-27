import { ISoftwareSettings } from "@/models/settings"

export class SoftwareSettings implements ISoftwareSettings {
    public distanceUnitType: string = 'IMPERIAL'
    public temperatureUnitType: string = 'FARENHEIGHT'
}
