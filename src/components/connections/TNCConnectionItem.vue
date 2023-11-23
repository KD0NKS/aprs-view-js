<template>
    <div class="row justify-between">
        <div class="col-xs-6 q-pa-sm">
            <q-select label="COM Port"
                :options="comPorts"
                v-model="model.comPort"
                :rules="[ rules.required ]"
                @focus="updateSerialPorts"
                dense
                >
            </q-select>
        </div>

        <div class="col-xs-6 q-pa-sm">
            <q-input label="Baud Rate" v-model="model.baudRate" type="number" dense />
        </div>
    </div>

    <div class="row justify-between">
        <div class="col-xs-6 q-pa-sm">
            <q-select label="Data Bits"
                :options="dataBitOptions"
                v-model="model.dataBits"
                :rules="[ rules.required ]"
                dense
                >
            </q-select>
        </div>

        <div class="col-xs-6 q-pa-sm">
            <q-select label="Stop Bits"
                :options="stopBitOptions"
                v-model="model.stopBits"
                :rules="[ rules.required ]"
                dense
                >
            </q-select>
        </div>
    </div>

    <div class="row justify-between">
        <div class="col-xs-6 q-pa-sm">
            <q-select label="Parity"
                :options="parityOptions"
                v-model="model.parity"
                :rules="[ rules.required ]"
                dense
                >
            </q-select>
        </div>

        <div class="col-xs-6 q-pa-sm">
            <q-select label="Character Set"
                :options="charSetOptions"
                v-model="model.charset"
                :rules="[ rules.required ]"
                dense
                >
            </q-select>
        </div>
    </div>

    <div class="row justify-between">
        <div class="col-xs-6 q-pa-sm">
            <q-input label="MYCALL Command" v-model="model.myCallCommand"  dense />
        </div>

        <div class="col-xs-6 q-pa-sm">
            <q-select label="EOL Character"
                :options="eolCharOptions"
                v-model="model.messageDelimeter"
                :rules="[ rules.required ]"
                emit-value
                map-options
                dense
                >
            </q-select>
        </div>
    </div>

    <div class="row justify-between">
        <div class="col-xs-6">
            <q-list dense>
                <draggable v-model="model.initCommands" item-key="index" @start="drag=true" @end="drag=false" handle=".handle" dense>
                    <template #item="{ element, index }">
                        <TNCCommand :command="element"
                                @removeCommand="removeCommand(model.initCommands, index)"
                                @updateCommand="updateCommand(model.initCommands, index, $event)"
                                emit-value
                                />
                    </template>
                </draggable>
            </q-list>

            <q-btn flat @click="addCommand(model.initCommands)"><q-icon name="add" />Add INIT COMMAND</q-btn>
        </div>

        <div class="col-xs-6">
            <q-list dense>
                <draggable v-model="model.exitCommands" item-key="index" @start="drag=true" @end="drag=false"  handle=".handle">
                    <template #item="{ element, index }">
                        <TNCCommand :command="element"
                                @removeCommand="removeCommand(model.exitCommands, index)"
                                @updateCommand="updateCommand(model.exitCommands, index, $event)"
                                emit-value
                                />
                    </template>
                </draggable>
            </q-list>

            <q-btn flat @click="addCommand(model.exitCommands)"><q-icon name="add" />Add INIT COMMAND</q-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"
    import draggable from 'vuedraggable'
    import _ from "lodash"

    import { EolCharEnum } from "../../enums"
    import { TNCConnection } from "../../models/connections"

    import TNCCommand from '../../components/connections/TNCCommand.vue'

    export default defineComponent({
        props: {
            model: {
                type: TNCConnection
                , required: true
            }
        }
        , components: {
            draggable
            , TNCCommand
        }
        , setup() {
            const comPorts = ref<string[]>([])

            return {
                comPorts
                , charSetOptions: [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ]
                , dataBitOptions: [ 5, 6, 7, 8 ]
                , parityOptions: [ 'none', 'even', 'odd', 'mark', 'space' ]
                , rules: {
                    required: value => !!value || 'Required.'
                }
                , stopBitOptions: [ 1, 2 ]
            }
        }
        , mounted() {
            this.updateSerialPorts()
        }
        , computed: {
            eolCharOptions() {
                return _.map(
                    Object.keys(EolCharEnum)
                    , key => {
                        return {
                            label: key
                            , value: EolCharEnum[key]
                        }
                    }
                )
            }
        }
        , methods: {
            addCommand(list: string[]): void {
                list.push('')
            }
            , removeCommand(list: string[], index: number): void {
                list.splice(index, 1)
            }
            , updateCommand(list: string[], index: number, event: string): void {
                list[index] = event
            }
            , async updateSerialPorts(): Promise<void> {
                // TODO: Sort by name
                this.comPorts = await window.connectionService.getComPorts()
            }
        }
        // TODO: May need watchers here
    })
</script>
