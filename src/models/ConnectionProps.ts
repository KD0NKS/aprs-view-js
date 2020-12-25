import { ConnectionTypes } from "@/enums/ConnectionTypes";
import { IConnection } from "./IConnection";

export class ConnectionProps implements IConnection {
    public id: string
    public name: string
    public connectionType: string

    public host?: string
    public port?: number
    public filter?: string
}