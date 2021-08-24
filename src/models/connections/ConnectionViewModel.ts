import { IConnection } from "./IConnection"

export class ConnectionViewModel implements IConnection {
    public id: string = ''
    public name: string = ''
    public connectionType: string = ''

    public host?: string = ''
    public port?: number = 0
    public filter?: string = ''
}
