import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import _ from "lodash";

import { ConnectionEventTypes, StorageKeys } from "../enums";
import { AbstractConnection, IConnection, ISConnection, KissTcipConnection, TNCConnection } from "../models/connections";
import { Mapper } from "../utils/mappers";

const _mapper = new Mapper()

export const useConectionStore = defineStore('connection', {
    state: () => ({
        connections: useStorage(StorageKeys.CONNECTION_SETTINGS, new Array<ISConnection | KissTcipConnection | TNCConnection>(), undefined, {
                serializer: {
                    read: (v: any) => {
                        let retVal = new Array<ISConnection | KissTcipConnection | TNCConnection>()

                        const obj = JSON.parse(v)

                        for(let c of obj) {
                            if(c.connectionType == 'IS_SOCKET') {
                                retVal.push(new ISConnection(c))
                            } else if(c.connectionType == 'KISS_TCIP') {
                                retVal.push(new KissTcipConnection(c))
                            } else if(c.connectionType == 'SERIAL_TNC') {
                                retVal.push(new TNCConnection(c))
                            }
                        }

                        return retVal;
                    }
                    , write: (v: any) => {
                        return JSON.stringify(v)
                    }
                }
            })
    }),
    getters: {
        getConnections: state => state.connections
        , getConnectionName: (state) => { return (connectionId: string | number) => state.connections.find((c) => c.id == connectionId)?.name }
    },
    actions: {
        addConnection(settings: IConnection) {
            let connection = _.find(this.connections, { id: settings.id })

            if(connection != null) {
                connection = settings
            } else {
                this.connections.push(settings)
            }

            window.connectionService.addConnection(settings)
        }
        , deleteConnection(connectionId: string) {
            const index = _.findIndex(this.connections, (c: IConnection) => c.id == connectionId)

            if(index > -1) {
                this.connections.splice(index, 1)

                window.connectionService.deleteConnection(connectionId)
            }
        }
        , saveConnection(settings: IConnection) {
            let connection = _.find(this.connections, c => c.id == settings.id)

            if(connection && connection != null) {
                if(connection.connectionType == settings.connectionType) {
                    _mapper.CopyInto<IConnection, IConnection>(settings, connection)
                } else {
                    const idx = _.findIndex(this.connections, (c: IConnection) => c.id == settings.id)

                    if(idx > -1) {
                        this.connections.splice(idx, 1, settings)
                    } else {
                        this.connections.push(settings)
                    }
                }

                window.connectionService.updateConnection(_.cloneDeep(settings))
            }

            // TODO: Error notification to tell user saving failed
        }
        , setConnectionStatus(connectionId: string, isEnabled: boolean) {
            let connection = _.find(this.connections, c => c.id == connectionId)

            if(connection != null) {
                connection.isEnabled = isEnabled
                window.connectionService.setConnectionStatus(connectionId, isEnabled)
            }
        }
        , updateConnectionStatus(id, status) {
            let connection = _.find(this.connections, { id: id }) as AbstractConnection

            if(connection != null) {
                connection.isConnected = status == ConnectionEventTypes.CONNECTED

                // Make sure the connection shows it's enabled on the front end
                if(connection.isConnected) {
                    connection.isEnabled = true
                }
            }
        }
    },
});
