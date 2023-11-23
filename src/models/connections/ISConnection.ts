import _ from "lodash"

import { AbstractConnection, IConnection } from "."

export class ISConnection extends AbstractConnection {
    public host?: string = null
    public port?: number = null
    public filter?: string = null

    constructor(connectionSettings?: IConnection) {
        super(connectionSettings)

        if(connectionSettings) {
            this.host = connectionSettings["host"] ?? null
            this.port = connectionSettings["port"] ?? 0
            this.filter = connectionSettings["filter"] ?? null
        }
    }

    public toJSON() {
        const jsonObj = super.toJSON()

        jsonObj["host"] = this.host
        jsonObj["port"] = this.port
        jsonObj["filter"] = this.filter

        return jsonObj
    }
}
