import { Connection, IConnection } from "@/models";
import { AbstractConnection } from "@/models/connections/AbstractConnection";
import { ISConnection } from "@/models/connections/ISConnection";

export class ConnectionFactory {
    public create(connection: AbstractConnection): ISConnection | null {
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

    private buildISSocket(connection: Partial<AbstractConnection>): AbstractConnection {
        return new ISConnection(connection)
    }

    private buildTNCConnection(connection: Partial<AbstractConnection>): AbstractConnection {
        return null
    }
}
