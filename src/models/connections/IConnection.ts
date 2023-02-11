export interface IConnection {
    // Required
    id: string
    name: string
    isAllowTransmit: boolean
    isEnabled: boolean

    connectionType: string

    toJSON()
}
