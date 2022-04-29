import { StringUtil } from "@/utils"
import { uid } from "quasar"

import { IConnection } from "@/models/connections"

export abstract class AbstractConnection {
    public id: string = uid()
    public isAllowTransmit: boolean = false
    public name: string = "Default"
    public connectionType: string = 'IS_SOCKET'

    public isConnected: boolean = false
    public isEnabled: boolean = false

    constructor(settings?: IConnection) {
        if(settings) {
            this.id = !StringUtil.IsNullOrWhiteSpace(settings["id"]) ? settings["id"] : uid()
            this.isAllowTransmit = settings["isAllowTransmit"] ?? false
            this.name = settings["name"] ?? "Default"
            this.connectionType = settings["connectionType"] ?? "IS_SOCKET"
        }
    }

    public toJSON() {
        const jsonObj = {}

        jsonObj["id"] = this.id
        jsonObj["isAllowTransmit"] = this.isAllowTransmit
        jsonObj["name"] = this.name
        jsonObj["connectionType"] = this.connectionType

        return jsonObj
    }
}
