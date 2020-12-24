import { Socket } from "net";

export default interface IConnection {
    // Required
    name: string;
    connectionType: Symbol
    connection: Socket;
    isEnabled: boolean;

    // IS Socket specific
    host?: string;
    port?: number;
    filter?: string;
}