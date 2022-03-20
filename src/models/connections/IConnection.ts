export interface IConnection {
    // Required
    id: string
    name: string
    isEnabled: boolean

    connectionType: string

    toJSON()
}
