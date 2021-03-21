import { ConnectionViewModel } from "@/models/ConnectionViewModel"

export default class ConnectionSettingsMapper {
    public static ObjectToConnectionSettings(obj: any): ConnectionViewModel {
        const retVal = new ConnectionViewModel()

        if (obj) {
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