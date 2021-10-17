<template>
    <v-expansion-panel :readonly="readonly">
        <v-expansion-panel-header>
            <div>
                <v-icon small color="green" v-if="connection.isConnected">mdi-power-plug</v-icon>
                <v-icon small color="red" v-else>mdi-power-plug-off</v-icon>
                {{ connection.name }}
            </div>
            <v-switch label="Enabled"
                    v-model="connection.isEnabled"
                    @click.native.stop
                    >
            </v-switch>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-container>
                <v-form
                        id="connection-settings-form"
                        @submit.prevent="save"
                        v-model="isValid"
                        >
                    <v-layout row wrap>
                        <v-flex xs12 md8 class="px-2">
                            <v-text-field label="Name" v-model="conn.name" :rules="[rules.required]"></v-text-field>
                        </v-flex>

                        <v-flex xs12 md4 class="px-2">
                            <v-select
                                :items="connectionTypeOptions"
                                item-text="name"
                                item-value="id"
                                v-model="conn.connectionType"
                            ></v-select>
                        </v-flex>
                    </v-layout>

                    <ISConnectionItem
                            v-if="conn.connectionType == 'IS_SOCKET'"
                            :connection = "conn"
                            :rules = "rules"
                            >
                    </ISConnectionItem>
                    <TNCConnectionItem
                            v-if="conn.connectionType == 'SERIAL_TNC'"
                            :connection = "conn"
                            :rules = "rules"
                            >
                    </TNCConnectionItem>

                    <v-layout row wrap>
                        <v-flex xs12 class="px-2">
                            <v-btn color="primary" class="mr-4" type="submit" :disabled="!isValid" form="connection-settings-form">Save</v-btn>
                            <v-btn color="normal" class="mr-4" @click="reset">Reset</v-btn>
                            <v-btn color="error" class="mr-4" @click="deleteConnection">Delete</v-btn>
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                        <v-flex xs12 md12 class="px-2">
                            <v-switch v-model="connection.isEnabled" label="Enabled"></v-switch>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-container>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>


<script lang="ts">
    import _ from 'lodash'
    import { Component, Prop, Vue } from 'vue-property-decorator'

    import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'
    import { AbstractConnection } from '@/models/connections/AbstractConnection'
    import { ConnectionTypes } from '@/enums/ConnectionTypes'
    import ISConnectionItem from '@/components/settings/connections/ISConnectionItem.vue'
    import TNCConnectionItem from '@/components/settings/connections/TNCConnectionItem.vue'
    import '@mdi/font/css/materialdesignicons.css'


    @Component({
        props: ['connection']
        , components: {
            ISConnectionItem
            , TNCConnectionItem
        }
    })
    export default class ConnectionItem extends Vue {
        @Prop()
        private connection: AbstractConnection

        private conn: ConnectionViewModel = new ConnectionViewModel()

        private isValid: boolean = false
        private readonly: boolean = false
        private rules = { required: value => !!value || "Required." }

        private created() {
            this.conn.id = this.connection.id

            this.reset()
        }

        private get connectionTypeOptions() {
            let map = []

            Object.keys(ConnectionTypes).forEach(k => {
                map.push({ id: k, name: ConnectionTypes[k] })
            });

            return map
        }

        private deleteConnection(): void {
            this.$emit('deleteConnection', this.conn.id)
        }

        private reset(): void {
            Vue.set(this.conn, 'name', this.connection.name)
            Vue.set(this.conn, 'connectionType', this.connection.connectionType)

            if(this.connection.connectionType == 'IS_SOCKET') {
                Vue.set(this.conn, 'host', this.connection["host"])
                Vue.set(this.conn, 'port', this.connection["port"])
                Vue.set(this.conn, 'filter', this.connection["filter"])
            } else if(this.connection.connectionType == 'SERIAL_TNC') {
                Vue.set(this.conn, 'autoOpen', this.connection["autoOpen"])
                Vue.set(this.conn, 'comPort', this.connection["comPort"])
                Vue.set(this.conn, 'charset', this.connection["charset"])
                Vue.set(this.conn, 'messageDelimeter', this.connection["messageDelimeter"])
                Vue.set(this.conn, 'myCallCommand', this.connection["myCallCommand"])
                Vue.set(this.conn, 'baudRate', this.connection["baudRate"])
                Vue.set(this.conn, 'dataBits', this.connection["dataBits"])
                Vue.set(this.conn, 'highWaterMark', this.connection["highWaterMark"])
                Vue.set(this.conn, 'lock', this.connection["lock"])
                Vue.set(this.conn, 'stopBits', this.connection["stopBits"])
                Vue.set(this.conn, 'parity', this.connection["parity"])
                Vue.set(this.conn, 'rtscts', this.connection["rtscts"])
                Vue.set(this.conn, 'xany', this.connection["xany"])
                Vue.set(this.conn, 'xon', this.connection["xon"])
                Vue.set(this.conn, 'xoff', this.connection["xoff"])

                // Arrays must be deep copied
                Vue.set(this.conn, 'exitCommands', [])
                _.forEach(this.connection["exitCommands"], c => {
                    this.conn.exitCommands.push(c)
                })

                Vue.set(this.conn, 'initCommands', [])
                _.forEach(this.connection["initCommands"], c => {
                    this.conn.initCommands.push(c)
                })
            }
        }

        private save(): void {
            if(this.isValid === true) {
                this.$emit('saveConnection', this.conn)
            }
        }
    }
</script>
