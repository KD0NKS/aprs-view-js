import { ISoftwareSettings } from "@/models/settings"

export class SoftwareSettings implements ISoftwareSettings {
    public distanceUnitType: string = 'IMPERIAL'
    public isDarkMode: boolean = false        // true, false, or auto
    public temperatureUnitType: string = 'FARENHEIGHT'
}
