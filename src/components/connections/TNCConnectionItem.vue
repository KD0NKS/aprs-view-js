<template>
    <div class="q-gutter-md row items-start">
        <q-select label="COM Port"
            :options="comPorts"
            v-model="model.comPort"
            :rules="[ rules.required ]"
            @focus="updateSerialPorts"
            class="col-6"
            >
        </q-select>

        <q-input label="Baud Rate" v-model="model.baudRate" type="number" class="col-5" />
    </div>

    <div class="q-gutter-md row items-start">
        <q-select label="Data Bits"
            :options="dataBitOptions"
            v-model="model.dataBits"
            :rules="[ rules.required ]"
            class="col-6"
            >
        </q-select>

        <q-select label="Stop Bits"
            :options="stopBitOptions"
            v-model="model.stopBits"
            :rules="[ rules.required ]"
            class="col-5"
            >
        </q-select>
    </div>

    <div class="q-gutter-md row items-start">
        <q-select label="Parity"
            :options="parityOptions"
            v-model="model.parity"
            :rules="[ rules.required ]"
            class="col-6"
            >
        </q-select>

        <q-select label="Character Set"
            :options="charSetOptions"
            v-model="model.charset"
            :rules="[ rules.required ]"
            class="col-5"
            >
        </q-select>
    </div>

    <div class="q-gutter-md row items-start">
        <q-input label="MYCALL Command" v-model="model.myCallCommand" class="col-6" />
        <q-select label="EOL Character"
            :options="eolCharOptions"
            v-model="model.messageDelimeter"
            :rules="[ rules.required ]"
            emit-value
            map-options
            class="col-5"
            >
        </q-select>
    </div>

    <div class="row">
        <div class="col-6">
            <q-list dense>
                <template v-for="(item, index) in model.initCommands" :key="index">
                    <TNCCommand :command="model.initCommands[index]"
                            @removeCommand="removeCommand(model.initCommands, index)"
                            @updateCommand="updateCommand(model.initCommands, index, $event)"
                            emit-value
                            />
                </template>
            </q-list>

            <q-btn flat @click="addCommand(model.initCommands)"><q-icon name="add" />Add INIT COMMAND</q-btn>
        </div>

        <div class="col-6">
            <q-list dense>
                <template v-for="(item, index) in model.exitCommands" :key="index">
                    <TNCCommand :command="model.exitCommands[index]"
                            @removeCommand="removeCommand(model.exitCommands, index)"
                            @updateCommand="updateCommand(model.exitCommands, index, $event)"
                            />
                </template>
            </q-list>

            <q-btn flat @click="addCommand(model.exitCommands)"><q-icon name="add" />Add INIT COMMAND</q-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from "vue"
    import { useStore } from '@/store'
    import _ from "lodash"

    import { EolCharEnum, GetterTypes } from "@/enums"
    import { TNCConnection } from "@/models/connections"

    import TNCCommand from '@/components/connections/TNCCommand.vue'

    export default defineComponent({
        props: {
            model: {
                type: TNCConnection
                , required: true
            }
        }
        , components: {
            TNCCommand
        }
        , setup() {
            const comPorts = ref<string[]>([])
            const store = useStore()

            return {
                comPorts
                , charSetOptions: [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ]
                , dataBitOptions: [ 5, 6, 7, 8 ]
                , parityOptions: [ 'none', 'even', 'odd', 'mark', 'space' ]
                , rules: {
                    required: value => !!value || 'Required.'
                }
                , stopBitOptions: [ 1, 2 ]
                , store
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
                this.comPorts = await this.store.getters[GetterTypes.GET_COM_PORTS]
            }
        }
        // TODO: May need watchers here
    })
</script>
