import { AbstractConnection, IConnection } from "@/models/connections"

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
}
