import { Connection, IConnection } from "@/models";

export class ConnectionFactory {
    public create(connection: IConnection): Connection {
        // TODO: Throw error if connection is null

        let retVal: Connection = new Connection()

        switch (connection.connectionType) {
            case 'IS_SOCKET':
                retVal = this.buildISSocket()
                break
            case 'SERIAL_TNC':
                retVal = this.buildTNCConnection()
                break
            // TODO: Throw error if connection type is not supported
        }

        return retVal
    }

    private buildISSocket(): Connection {
        return null
    }

    private buildTNCConnection(): Connection {
        return null
    }
}
