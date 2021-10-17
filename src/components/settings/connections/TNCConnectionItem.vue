<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-select
                    :items="comPorts"
                    item-text="path"
                    item-value="path"
                    label="COM Port"
                    v-model="connection.comPort"
                ></v-select>
            </v-flex>

            <v-flex xs12 md6 class="px-2">
                <v-text-field label="Baud Rate" type="number" v-model="connection.baudRate"></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-select
                    :items="dataBitOptions"
                    label="Data Bit"
                    v-model="connection.dataBits"
                    >
                </v-select>
            </v-flex>

            <v-flex xs12 md6 class="px-2">
                <v-select
                    :items="stopBitOptions"
                    label="Stop Bits"
                    v-model="connection.stopBits"
                    >
                </v-select>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-select
                    :items="parityOptions"
                    label="Parity"
                    v-model="connection.parity"
                    >
                </v-select>
            </v-flex>

            <v-flex xs12 md6 class="px-2">
                <v-select
                    :items="charSetOptions"
                    label="Character Set"
                    v-model="connection.charset"
                    >
                </v-select>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 md6 class="px-2">
                <v-text-field label="MYCALL Command" v-model="connection.myCallCommand"></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="px-2">
                <v-select
                    :items="eolCharOptions"
                    item-text="key"
                    item-value="value"
                    label="EOL Character"
                    v-model="connection.messageDelimeter"
                    >
                </v-select>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12 md6 class="px-2">
                <v-list v-model="connection.initCommands">
                    <v-subheader>Init Commands</v-subheader>

                    <draggable v-model="connection.initCommands" @start="drag=true" @end="drag=false" handle=".handle">
                        <div v-for="(item, index) in connection.initCommands" :key="index">
                            <!-- TODO: Deep copying may not need to be done in the parent if this had a key?... works for now -->
                            <TNCCommand :command.sync="connection.initCommands[index]"
                                    v-on:removeCommand="removeCommand(connection.initCommands, index)"
                                    />
                        </div>
                    </draggable>
                    <v-list-item xs3>
                        <v-list-item-content>
                            <div>
                                <v-btn text @click="addCommand(connection.initCommands)"><v-icon>mdi-plus</v-icon> Add Init Command</v-btn>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-flex>
            <v-flex xs12 md6 class="px-2">
                <v-list v-model="connection.exitCommands">
                    <v-subheader>Exit Commands</v-subheader>

                    <draggable v-model="connection.exitCommands" @start="drag=true" @end="drag=false">
                        <div v-for="(item, index) in connection.exitCommands" :key="index">
                            <!-- TODO: Deep copying may not need to be done in the parent if this had a key?... works for now -->
                            <TNCCommand :command.sync="connection.exitCommands[index]"
                                    v-on:removeCommand="removeCommand(connection.exitCommands, index)"
                                    />
                        </div>
                    </draggable>
                    <v-list-item xs3>
                        <v-list-item-content>
                            <div>
                                <v-btn text @click="addCommand(connection.exitCommands)"><v-icon>mdi-plus</v-icon> Add Exit Command</v-btn>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-flex>
        </v-layout>

        <!--
            NOTE: an rtscts option may need to be added.  this is a send/clear to send flow control for RS-232 chips
        -->
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
    import draggable from 'vuedraggable'

    import _ from 'lodash'
    import { EolCharEnum } from '@/enums'
    import { ConnectionViewModel } from '@/models/connections/ConnectionViewModel'
    import { SerialPortUtil } from 'js-aprs-tnc'
    import TNCCommand from '@/components/settings/connections/TNCCommand.vue'

    @Component({
        props: [ 'connection', 'rules' ]
        , components: {
            draggable
            , TNCCommand
        }
    })
    export default class TNCConnectionItem extends Vue {
        @Prop()
        private rules: any

        @Prop()
        private connection: ConnectionViewModel
        private comPorts = []

        private charSetOptions = [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ]
        private dataBitOptions = [ 5, 6, 7, 8]
        private stopBitOptions = [ 1, 2 ]
        private parityOptions = [ 'none', 'even', 'odd', 'mark', 'space' ]

        constructor() {
            super()

            // Get all available serial ports
            SerialPortUtil.getAvailableSerialPorts().then((ports) => {
                _.forEach(ports, port => {
                    if(port.manufacturer
                            || port.serialNumber
                            || port.pnpId
                            || port.locationId
                            || port.productId
                            || port.vendorId) {
                        this.comPorts.push(port)
                    }
                })
            })
        }

        private get eolCharOptions() {
            let map = []

            Object.keys(EolCharEnum).forEach(k => {
                map.push({ key: k, value: EolCharEnum[k] })
            });

            return map
        }

        private addCommand(list): void {
            list.push("")
        }

        private removeCommand(list, index): void {
            list.splice(index, 1)
        }
    }
</script>
