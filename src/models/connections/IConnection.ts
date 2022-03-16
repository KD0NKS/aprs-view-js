export interface IConnection {
    // Required
    id: string
    name: string

    connectionType: string

    toJSON()
}
