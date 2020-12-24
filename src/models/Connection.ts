import { Socket } from "net";
import ConnectionTypes from "@/enums/ConnectionTypes";
import { ISSocket } from "js-aprs-is";
import * as crypto from "crypto";

/**
 * @property { string } name Name of the connection
 * @property { Socket } connection The actual connection reading APRS data
 * @property { ConnectionTypeEnum } connectionType Key value from the ConnectionTypeEnum
 * @property { bool } isEnabled Whether or not the connection is enabled by default
 */
export default class Connection {
    public id: string = crypto.randomBytes(16).toString('hex');;
    public name: string;
    public connectionType: Symbol

    public host?: string;
    public port?: number;
    public filter?: string;

    private _connection: Socket;
    private _isConnected: boolean;
    private _isEnabled: boolean = false;
    private DISCONNECT_EVENTS: string[] = ['destroy', 'end', 'close', 'error', 'timeout'];
    private CONNECT_EVENTS: string[] = ['connect'];

    public get isConnected(): boolean {
        return this._isConnected;
    }

    public get isEnabled(): boolean {
        return this._isEnabled;
    }

    public set isEnabled(isEnabled: boolean) {
        this._isEnabled = isEnabled;

        if (this._connection) {
            if (this.connectionType === ConnectionTypes.IS_SOCKET) {
                if (this._isEnabled === false) {
                    this._connection.end();  // planning to depricate disconnect
                } else {
                    (this._connection as ISSocket).connect();
                }
            }
        }
    }

    public get connection(): Socket {
        return this._connection;
    }

    public set connection(conn: Socket) {
        if (this._connection || this._connection !== null || this.connection !== undefined) {
            this._connection.end();
            this._connection.destroy();
        }

        this._connection = conn;

        // This won't work since connection is null
        for (var e in this.DISCONNECT_EVENTS) {
            this._connection.on(e, () => {
                this._isConnected = false;
            });
        };

        for (var e in this.CONNECT_EVENTS) {
            this._connection.on(e, () => {
                this._isConnected = true;
            });
        };
    }
}