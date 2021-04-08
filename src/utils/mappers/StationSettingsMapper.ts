import { StationSettings } from "@/models/StationSettings"

export class StationSettingsMapper {
    public static ObjectToStationSettings(obj: any): StationSettings {
        const retVal = new StationSettings()

        if(obj) {
            Object.keys(retVal).forEach(k => {
                if (obj[k]) {
                    retVal[k] = obj[k]
                } else {
                    retVal[k] = null
                }
            })
        }

        return retVal
    }
}
