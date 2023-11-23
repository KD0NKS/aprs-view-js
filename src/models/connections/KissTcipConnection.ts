import _ from "lodash"

import { AbstractConnection, IConnection } from "."

export class KissTcipConnection extends AbstractConnection {
    public host?: string = null
    public port?: number = null

    constructor(connectionSettings?: IConnection) {
        super(connectionSettings)

        if(connectionSettings) {
            this.host = connectionSettings["host"] ?? null
            this.port = connectionSettings["port"] ?? 0
        }
    }

    public toJSON() {
        const jsonObj = super.toJSON()

        jsonObj["host"] = this.host
        jsonObj["port"] = this.port

        return jsonObj
    }
}
