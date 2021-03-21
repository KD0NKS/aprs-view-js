export interface IConnection {
    // Required
    id: string
    name: string

    connectionType: string

    // IS Socket specific
    filter?: string
    host?: string
    port?: number
}