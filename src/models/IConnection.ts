import { Socket } from "net";

export interface IConnection {
    // Required
    id: string
    name: string
    connectionType: string

    // IS Socket specific
    host?: string
    port?: number
    filter?: string
}