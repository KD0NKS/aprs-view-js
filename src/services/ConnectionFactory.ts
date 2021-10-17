import { IConnection } from "@/models/connections/IConnection";
import { AbstractConnection } from "@/models/connections/AbstractConnection";
import { ISConnection } from "@/models/connections/ISConnection";
import { TNCConnection } from "@/models/connections/TNCConnection";

export class ConnectionFactory {
    public create(connection: IConnection): AbstractConnection {
        // TODO: Throw error if connection is null

        let retVal: AbstractConnection = null

        switch (connection.connectionType) {
            case 'IS_SOCKET':
                retVal = this.buildISSocket(connection)
                break
            case 'SERIAL_TNC':
                retVal = this.buildTNCConnection(connection)
                break
            // TODO: Throw error if connection type is not supported
        }

        return retVal
    }

    private buildISSocket(connection: IConnection): AbstractConnection {
        return new ISConnection(connection)
    }

    private buildTNCConnection(connection: IConnection): AbstractConnection {
        return new TNCConnection(connection)
    }
}
