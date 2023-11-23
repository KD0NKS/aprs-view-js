<template>
    <q-expansion-item expand-separator dense>
        <template v-slot:header>
            <q-item-section avatar>
                <q-icon color="green" name="link" v-if="connection.isConnected == true" />
                <q-icon color="red" name="link_off" v-if="connection.isConnected == false" />
            </q-item-section>

            <q-item-section>
                <q-item-label>{{ connection.name }}</q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-toggle v-model="model.isEnabled" @click="setConnectionStatus" />
            </q-item-section>
        </template>

        <q-card class="q-pa-md">
            <q-form dense
                    :greedy="false"
                    @reset="onReset"
                    @submit="onSubmit">
                <div class="q-gutter-md row" dense>
                    <q-input label="Name" v-model="model.name" :rules="[ rules.required ]" class="col-8" dense />
                    <q-select label="Connection Type"
                            v-model="model.connectionType"
                            :options="connectionTypeOptions"
                            @update:model-value="changeConnectionType"
                            class="col-3"
                            emit-value
                            map-options
                            dense
                            >
                    </q-select>
                </div>

                <div class="q-gutter-md row" style="margin-bottom: 10px;">
                    <q-toggle v-model="model.isAllowTransmit" label="Allow Transmit" />
                </div>

                <ISConnectionItem :model="model" v-if="model.connectionType == 'IS_SOCKET'" />
                <KissTcipConnectionItem :model="model" v-if="model.connectionType == 'KISS_TCIP'" />
                <TNCConnectionItem :model="model" v-if="model.connectionType == 'SERIAL_TNC'" />

                <div class="q-gutter-md row">
                    <q-btn label="Save" type="submit" color="primary" />
                    <q-btn label="Reset" type="reset" />
                    <q-btn label="Delete" @click="deleteConnection" color="red" />
                </div>
            </q-form>
        </q-card>
    </q-expansion-item>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"
    import { useConectionStore } from '../../stores/connectionStore'
    import _ from "lodash"

    import { ConnectionTypes } from "../../enums"
    import { Mapper } from "../../utils/mappers"
    import { ISConnection, KissTcipConnection, TNCConnection } from "../../models/connections"

    import ISConnectionItem from "./ISConnectionItem.vue"
    import KissTcipConnectionItem from "./KissTcipConnectionItem.vue"
    import TNCConnectionItem from "./TNCConnectionItem.vue"

    export default defineComponent({
        props: {
            connection: {
                type: [ ISConnection, KissTcipConnection, TNCConnection ],
                required: true
            }

        }
        , components: {
            ISConnectionItem
            , KissTcipConnectionItem
            , TNCConnectionItem
        }
        , setup(props, { emit }) {
            const mapper = new Mapper()
            const store = useConectionStore()
            let temp = null

            if(props.connection.connectionType == 'IS_SOCKET') {
                temp = new ISConnection()
                mapper.CopyInto<ISConnection, ISConnection>(_.cloneDeep(props.connection) as ISConnection, temp)
            } else if(props.connection.connectionType == 'KISS_TCIP') {
                temp = new KissTcipConnection()
                mapper.CopyInto<KissTcipConnection, KissTcipConnection>(_.cloneDeep(props.connection) as KissTcipConnection, temp)
            } else if(props.connection.connectionType == 'SERIAL_TNC') {
                temp = new TNCConnection()
                mapper.CopyInto<TNCConnection, TNCConnection>(_.cloneDeep(props.connection) as TNCConnection, temp)
            }

            const model = ref(temp)

            // TODO: Else throw error

            return {
                mapper
                , model
                , store
                , rules: {
                    required: value => !!value || 'Required.'
                }
                , onReset() {
                    if(props.connection.connectionType == 'IS_SOCKET') {
                        mapper.CopyInto<ISConnection, ISConnection>(_.cloneDeep(props.connection) as ISConnection, model.value)
                    } else if(props.connection.connectionType == 'KISS_TCIP') {
                        mapper.CopyInto<KissTcipConnection, KissTcipConnection>(_.cloneDeep(props.connection) as KissTcipConnection, model.value)
                    } else if(props.connection.connectionType == 'SERIAL_TNC') {
                        mapper.CopyInto<TNCConnection, TNCConnection>(_.cloneDeep(props.connection) as TNCConnection, model.value)
                    }
                    // TODO: Else throw error
                }
                , onSubmit() {
                    store.saveConnection(model.value)
                }
            }
        }
        , computed: {
            connectionTypeOptions() {
                return _.map(
                    Object.keys(ConnectionTypes)
                    , key => {
                        return {
                            label: ConnectionTypes[key]
                            , value: key
                        }
                    }
                )
            }
        }
        , methods: {
            changeConnectionType(value) {
                if(value == 'IS_SOCKET') {
                    let conn = new ISConnection()

                    conn.id = this.model.id
                    conn.connectionType = 'IS_SOCKET'
                    conn.name = this.model['name'] ?? ''
                    conn.filter = this.model['filter'] ?? ''
                    conn.host = this.model['host'] ?? ''
                    conn.port = this.model['port'] ?? null

                    this.model = conn
                } else if(value == 'KISS_TCIP') {
                    let conn = new KissTcipConnection()

                    conn.id = this.model.id
                    conn.connectionType = 'KISS_TCIP'
                    conn.name = this.model['name'] ?? ''
                    conn.host = this.model['host'] ?? ''
                    conn.port = this.model['port'] ?? null

                    this.model = conn
                } else if(value == 'SERIAL_TNC') {
                    let conn = new TNCConnection()

                    conn.id = this.model.id
                    conn.connectionType = 'SERIAL_TNC'
                    conn.name = this.model['name'] ?? ''
                    conn.comPort = this.model['comPort'] ?? ''
                    conn.exitCommands = this.model["exitCommands"] ?? []
                    conn.initCommands = this.model["initCommands"] ?? []
                    conn.myCallCommand = this.model['myCallCommand'] ?? ''
                    conn.baudRate = this.model["baudRate"]
                    conn.charset = this.model["charset"]
                    conn.dataBits = this.model["dataBits"]
                    conn.stopBits = this.model["stopBits"]
                    conn.messageDelimeter = this.model["messageDelimeter"] = '\r'

                    this.model = conn
                }
            }
            , setConnectionStatus() {
                this.store.setConnectionStatus(this.model.id, this.model.isEnabled)
            }
            , deleteConnection() {
                this.store.deleteConnection(this.model.id)
            }
        }
    })
</script>
